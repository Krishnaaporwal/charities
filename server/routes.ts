import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema, insertCampaignSchema, insertDonationSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { predictCampaignSuccess } from "./ml/successPredictionModel";
import { extractFraudFeatures, predictFraudProbability, detectSuspiciousContent } from "./ml/fraudDetectionModel";
import { preprocessCampaignData } from "./ml/dataProcessing";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  const apiRouter = app.route('/api');

  // Campaign routes
  app.get('/api/campaigns', async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      
      if (category) {
        const campaigns = await storage.getCampaignsByCategory(category);
        return res.json(campaigns);
      }
      
      const campaigns = await storage.getAllCampaigns();
      res.json(campaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      res.status(500).json({ message: 'Failed to fetch campaigns' });
    }
  });

  app.get('/api/campaigns/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid campaign ID' });
      }
      
      const campaign = await storage.getCampaign(id);
      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }
      
      res.json(campaign);
    } catch (error) {
      console.error('Error fetching campaign:', error);
      res.status(500).json({ message: 'Failed to fetch campaign' });
    }
  });

  app.post('/api/campaigns', async (req: Request, res: Response) => {
    try {
      const campaignData = insertCampaignSchema.parse(req.body);
      const campaign = await storage.createCampaign(campaignData);
      res.status(201).json(campaign);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error('Error creating campaign:', error);
      res.status(500).json({ message: 'Failed to create campaign' });
    }
  });

  app.get('/api/campaigns/:id/donations', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid campaign ID' });
      }
      
      const donations = await storage.getDonationsByCampaign(id);
      res.json(donations);
    } catch (error) {
      console.error('Error fetching donations:', error);
      res.status(500).json({ message: 'Failed to fetch donations' });
    }
  });

  // Donation routes
  app.post('/api/donations', async (req: Request, res: Response) => {
    try {
      const donationData = insertDonationSchema.parse(req.body);
      
      // Check if campaign exists
      const campaign = await storage.getCampaign(donationData.campaignId);
      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }
      
      const donation = await storage.createDonation(donationData);
      res.status(201).json(donation);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error('Error creating donation:', error);
      res.status(500).json({ message: 'Failed to create donation' });
    }
  });

  // Waitlist routes
  app.post('/api/waitlist', async (req: Request, res: Response) => {
    try {
      const { email } = insertWaitlistSchema.parse(req.body);
      
      // Check if email is already in waitlist
      const exists = await storage.isEmailInWaitlist(email);
      if (exists) {
        return res.status(400).json({ message: 'Email already in waitlist' });
      }
      
      const waitlistEntry = await storage.addToWaitlist({ email });
      res.status(201).json({ message: 'Successfully added to waitlist' });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error('Error adding to waitlist:', error);
      res.status(500).json({ message: 'Failed to add to waitlist' });
    }
  });

  // AI/ML Endpoints
  
  // Campaign Success Prediction
  app.post('/api/campaigns/predict-success', async (req: Request, res: Response) => {
    try {
      const { 
        title, 
        description, 
        goalAmount, 
        category, 
        mediaUrls, 
        durationInDays 
      } = req.body;
      
      if (!title || !description || !goalAmount || !durationInDays) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      // Get user info (in a real app, this would come from auth)
      // For demo, we'll use a default value or user ID if provided
      const creatorId = req.body.creatorId || 1;
      const creator = await storage.getUser(creatorId);
      
      // Get creator's previous campaigns
      const creatorCampaigns = await storage.getCampaignsByCreator(creatorId);
      const successfulCampaigns = creatorCampaigns.filter(
        c => parseFloat(c.raisedAmount) >= parseFloat(c.goalAmount)
      ).length;
      
      // Calculate creator history score
      const creatorHistoryScore = creatorCampaigns.length > 0 
        ? successfulCampaigns / creatorCampaigns.length * 10 
        : 5; // Default score for new creators
      
      // Check if campaign has video
      const hasVideo = mediaUrls 
        ? mediaUrls.some((url: string) => 
            url.includes('youtube.com') || 
            url.includes('vimeo.com') || 
            url.endsWith('.mp4')
          )
        : false;
      
      // Count images
      const imageCount = mediaUrls 
        ? mediaUrls.filter((url: string) => 
            url.endsWith('.jpg') || 
            url.endsWith('.jpeg') || 
            url.endsWith('.png') || 
            url.endsWith('.gif')
          ).length
        : 0;
      
      // Create a mock campaign object for preprocessing
      const campaignData = {
        id: 0,
        title,
        description,
        goalAmount,
        category,
        creatorHistoryScore,
        hasVideo,
        imageCount,
        duration: durationInDays,
        wasSuccessful: false  // Doesn't matter for prediction
      };
      
      // Preprocess the single campaign
      const processed = preprocessCampaignData([campaignData])[0];
      
      // Get prediction
      const prediction = await predictCampaignSuccess(processed.features);
      
      if (!prediction) {
        return res.status(500).json({ error: "Prediction model unavailable" });
      }
      
      // Generate suggestions based on the campaign data
      const suggestions = [];
      
      if (description.length < 1000) {
        suggestions.push("Add more details to your campaign description");
      }
      
      if (!hasVideo) {
        suggestions.push("Add a video to increase your chances of success");
      }
      
      if (imageCount < 3) {
        suggestions.push("Add more images to showcase your campaign");
      }
      
      if (parseFloat(goalAmount) > 50000 && prediction.successProbability < 0.4) {
        suggestions.push("Consider lowering your funding goal for a higher chance of success");
      }
      
      if (durationInDays < 20) {
        suggestions.push("Consider a longer campaign duration to reach more potential donors");
      } else if (durationInDays > 60) {
        suggestions.push("Very long campaigns can lose momentum. Consider a shorter duration for better results");
      }
      
      // Return prediction results
      res.json({
        successProbability: Math.round(prediction.successProbability * 100),
        isLikelySuccessful: prediction.isLikelySuccessful,
        confidenceLevel: prediction.confidenceLevel,
        suggestions
      });
    } catch (error) {
      console.error("Error predicting campaign success:", error);
      res.status(500).json({ error: "Failed to predict campaign success" });
    }
  });

  // Fraud Risk Detection
  app.post('/api/campaigns/fraud-check', async (req: Request, res: Response) => {
    try {
      const { campaignId, description, goalAmount } = req.body;
      
      if (!description || !goalAmount) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      // Extract fraud features
      const fraudFeatures = await extractFraudFeatures(
        campaignId || 0,  // Use 0 for new campaigns
        description,
        goalAmount
      );
      
      // Check for suspicious content
      const suspiciousContent = detectSuspiciousContent(description);
      
      // Get fraud prediction
      const fraudPrediction = await predictFraudProbability(fraudFeatures);
      
      // Return detailed risk assessment
      res.json({
        riskScore: Math.round(fraudPrediction.fraudProbability * 100),
        riskLevel: fraudPrediction.riskLevel,
        flaggedPhrases: suspiciousContent.flaggedPhrases,
        recommendations: generateFraudPreventionRecommendations(
          fraudFeatures, 
          fraudPrediction.riskLevel
        )
      });
    } catch (error) {
      console.error("Error checking fraud risk:", error);
      res.status(500).json({ error: "Failed to check fraud risk" });
    }
  });

  // Helper function to generate fraud prevention recommendations
  function generateFraudPreventionRecommendations(features, riskLevel) {
    const recommendations = [];
    
    if (features.suspiciousWords > 0) {
      recommendations.push("Review your campaign description for promotional language that might trigger fraud warnings");
    }
    
    if (features.mediaCount < 2) {
      recommendations.push("Add more media content to establish legitimacy");
    }
    
    if (features.externalLinksCount > 5) {
      recommendations.push("Reduce the number of external links to lower suspicious activity flags");
    }
    
    if (features.creatorAccountAge < 30 && parseFloat(features.goalAmount) > 10000) {
      recommendations.push("New accounts with large funding goals face higher scrutiny. Consider building platform reputation first");
    }
    
    if (riskLevel === 'high') {
      recommendations.push("Consider completing identity verification to reduce risk score");
    }
    
    return recommendations;
  }

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}

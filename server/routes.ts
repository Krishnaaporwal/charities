import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema, insertCampaignSchema, insertDonationSchema, insertNgoReportSchema, insertNgoMilestoneSchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { predictCampaignSuccess, detectFraudRisk, trainSuccessModel, trainFraudModel } from "./ml/pythonService";

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
      
      // Send campaign data to Python service for prediction
      const campaignData = {
        title,
        description,
        goalAmount,
        category,
        mediaUrls: mediaUrls || [],
        durationInDays,
        creatorId
      };
      
      // Get prediction from Python service
      const prediction = await predictCampaignSuccess(campaignData);
      
      // Return prediction results directly from Python model
      res.json(prediction);
    } catch (error) {
      console.error("Error predicting campaign success:", error);
      res.status(500).json({ 
        error: "Failed to predict campaign success",
        message: error.message 
      });
    }
  });

  // Fraud Risk Detection
  app.post('/api/campaigns/fraud-check', async (req: Request, res: Response) => {
    try {
      const { campaignId, description, goalAmount } = req.body;
      
      if (!description || !goalAmount) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
      
      // Send campaign data to Python service for fraud detection
      const campaignData = {
        campaignId: campaignId || 0,
        description,
        goalAmount
      };
      
      // Get fraud assessment from Python service
      const fraudAssessment = await detectFraudRisk(campaignData);
      
      // Return assessment results directly from Python model
      res.json(fraudAssessment);
    } catch (error) {
      console.error("Error checking fraud risk:", error);
      res.status(500).json({ 
        error: "Failed to check fraud risk",
        message: error.message 
      });
    }
  });
  
  // Add endpoints for model training
  app.post('/api/train/success-model', async (req: Request, res: Response) => {
    try {
      const result = await trainSuccessModel();
      res.json(result);
    } catch (error) {
      console.error("Error training success model:", error);
      res.status(500).json({ 
        error: "Failed to train success model",
        message: error.message 
      });
    }
  });

  app.post('/api/train/fraud-model', async (req: Request, res: Response) => {
    try {
      const result = await trainFraudModel();
      res.json(result);
    } catch (error) {
      console.error("Error training fraud model:", error);
      res.status(500).json({ 
        error: "Failed to train fraud model",
        message: error.message 
      });
    }
  });

  // NGO Reports routes
  app.get('/api/ngo-reports', async (req: Request, res: Response) => {
    try {
      const campaignId = req.query.campaignId ? parseInt(req.query.campaignId as string) : undefined;
      
      if (campaignId) {
        const reports = await storage.getNgoReportsByCampaign(campaignId);
        return res.json(reports);
      }
      
      // Return all reports if no campaignId specified
      res.json([]);
    } catch (error) {
      console.error('Error fetching NGO reports:', error);
      res.status(500).json({ message: 'Failed to fetch NGO reports' });
    }
  });

  app.get('/api/ngo-reports/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid report ID' });
      }
      
      const report = await storage.getNgoReport(id);
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
      
      res.json(report);
    } catch (error) {
      console.error('Error fetching NGO report:', error);
      res.status(500).json({ message: 'Failed to fetch NGO report' });
    }
  });

  app.post('/api/ngo-reports', async (req: Request, res: Response) => {
    try {
      const reportData = insertNgoReportSchema.parse(req.body);
      
      // Check if campaign exists
      const campaign = await storage.getCampaign(reportData.campaignId);
      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }
      
      // Check if campaign is NGO type
      if (campaign.creatorType !== 'ngo') {
        return res.status(400).json({ message: 'Only NGO campaigns can add reports' });
      }
      
      const report = await storage.createNgoReport(reportData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error('Error creating NGO report:', error);
      res.status(500).json({ message: 'Failed to create NGO report' });
    }
  });

  // NGO Milestones routes
  app.get('/api/ngo-milestones', async (req: Request, res: Response) => {
    try {
      const campaignId = req.query.campaignId ? parseInt(req.query.campaignId as string) : undefined;
      
      if (campaignId) {
        const milestones = await storage.getNgoMilestonesByCampaign(campaignId);
        return res.json(milestones);
      }
      
      // Return all milestones if no campaignId specified
      res.json([]);
    } catch (error) {
      console.error('Error fetching NGO milestones:', error);
      res.status(500).json({ message: 'Failed to fetch NGO milestones' });
    }
  });

  app.get('/api/ngo-milestones/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid milestone ID' });
      }
      
      const milestone = await storage.getNgoMilestone(id);
      if (!milestone) {
        return res.status(404).json({ message: 'Milestone not found' });
      }
      
      res.json(milestone);
    } catch (error) {
      console.error('Error fetching NGO milestone:', error);
      res.status(500).json({ message: 'Failed to fetch NGO milestone' });
    }
  });

  app.post('/api/ngo-milestones', async (req: Request, res: Response) => {
    try {
      const milestoneData = insertNgoMilestoneSchema.parse(req.body);
      
      // Check if campaign exists
      const campaign = await storage.getCampaign(milestoneData.campaignId);
      if (!campaign) {
        return res.status(404).json({ message: 'Campaign not found' });
      }
      
      // Check if campaign is NGO type
      if (campaign.creatorType !== 'ngo') {
        return res.status(400).json({ message: 'Only NGO campaigns can add milestones' });
      }
      
      const milestone = await storage.createNgoMilestone(milestoneData);
      res.status(201).json(milestone);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }
      
      console.error('Error creating NGO milestone:', error);
      res.status(500).json({ message: 'Failed to create NGO milestone' });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}

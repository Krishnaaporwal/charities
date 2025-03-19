import * as fs from 'fs';
import * as csv from 'csv-parser';
import { Campaign } from '../../shared/schema';
import { storage } from '../storage';

interface CampaignData {
  id: number;
  title: string;
  description: string;
  goalAmount: string;
  category: string;
  creatorHistoryScore: number;
  hasVideo: boolean;
  imageCount: number;
  duration: number;
  // Target variable
  wasSuccessful: boolean;
}

export async function collectCampaignData(): Promise<CampaignData[]> {
  // In a real scenario, you'd fetch this from your database
  try {
    // Get all campaigns from storage
    const allCampaigns = await storage.getAllCampaigns();
    
    // Filter completed campaigns that have passed their deadline
    const completedCampaigns = allCampaigns.filter(campaign => {
      const deadline = new Date(campaign.deadline);
      return Date.now() > deadline.getTime();
    });
    
    // Transform the campaigns into the format we need
    const campaignData: CampaignData[] = await Promise.all(
      completedCampaigns.map(async (campaign) => {
        // Get creator's previous campaigns
        const creatorCampaigns = await storage.getCampaignsByCreator(campaign.creatorId);
        const previousCampaigns = creatorCampaigns.filter(c => c.id !== campaign.id);
        
        // Calculate a score based on creator's history
        const successfulPreviousCampaigns = previousCampaigns.filter(
          c => parseFloat(c.raisedAmount) >= parseFloat(c.goalAmount)
        ).length;
        
        const creatorHistoryScore = previousCampaigns.length > 0 
          ? successfulPreviousCampaigns / previousCampaigns.length * 10 
          : 5; // Default score for new creators
        
        // Check if campaign has video
        const hasVideo = campaign.mediaUrls 
          ? campaign.mediaUrls.some(url => 
              url.includes('youtube.com') || 
              url.includes('vimeo.com') || 
              url.endsWith('.mp4')
            )
          : false;
        
        // Count images
        const imageCount = campaign.mediaUrls 
          ? campaign.mediaUrls.filter(url => 
              url.endsWith('.jpg') || 
              url.endsWith('.jpeg') || 
              url.endsWith('.png') || 
              url.endsWith('.gif')
            ).length
          : 0;
        
        // Calculate campaign duration in days
        const createdAt = new Date(campaign.createdAt);
        const deadline = new Date(campaign.deadline);
        const durationMs = deadline.getTime() - createdAt.getTime();
        const duration = Math.ceil(durationMs / (1000 * 60 * 60 * 24));
        
        // Determine if the campaign was successful
        const wasSuccessful = parseFloat(campaign.raisedAmount) >= parseFloat(campaign.goalAmount);
        
        return {
          id: campaign.id,
          title: campaign.title,
          description: campaign.description,
          goalAmount: campaign.goalAmount,
          category: campaign.category,
          creatorHistoryScore,
          hasVideo,
          imageCount,
          duration,
          wasSuccessful
        };
      })
    );
    
    return campaignData;
  } catch (error) {
    console.error("Error collecting campaign data:", error);
    return [];
  }
}

export function preprocessCampaignData(campaigns: CampaignData[]) {
  // Feature engineering and normalization
  return campaigns.map(campaign => {
    // Text length can be a useful feature
    const descriptionLength = campaign.description.length;
    const titleLength = campaign.title.length;
    
    // Normalize numerical features to [0,1] range
    const normalizedGoal = Math.log(parseFloat(campaign.goalAmount)) / 25; // Log-scale normalization
    const normalizedDuration = campaign.duration / 90; // Assuming max 90 days
    
    return {
      features: [
        normalizedGoal,
        campaign.creatorHistoryScore / 10, // Normalize by max score
        campaign.hasVideo ? 1 : 0,
        Math.min(campaign.imageCount / 10, 1), // Cap at 10 images
        normalizedDuration,
        descriptionLength / 5000, // Normalize by max length
        titleLength / 100
      ],
      label: campaign.wasSuccessful ? 1 : 0
    };
  });
}

export function splitTrainTestData(data: any[], testRatio = 0.2) {
  // Shuffle the data
  const shuffled = [...data].sort(() => 0.5 - Math.random());
  
  const testSize = Math.floor(data.length * testRatio);
  const testData = shuffled.slice(0, testSize);
  const trainData = shuffled.slice(testSize);
  
  return { trainData, testData };
}
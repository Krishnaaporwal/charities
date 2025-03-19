import * as tf from '@tensorflow/tfjs-node';
import { RandomForestClassifier as RF } from 'ml-random-forest';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import { storage } from '../storage';

// Fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Features for fraud detection
interface CampaignFraudFeatures {
  id: number;
  creatorAccountAge: number;        // In days
  previousCampaigns: number;        // Number of previous campaigns
  successfulCampaigns: number;      // Number of successful previous campaigns
  verificationLevel: number;        // 0-3 scale
  suspiciousWords: number;          // Count of suspicious words/phrases
  externalLinksCount: number;       // Number of external links
  mediaCount: number;               // Number of images/videos
  goalAmount: string;               // Funding goal
  descriptionLength: number;        // Length of description
  updateFrequency: number;          // Updates per week (for existing campaigns)
  // Target variable (for training)
  isFraudulent?: boolean;
}

const MODEL_PATH = path.join(__dirname, '../models/fraud_detection_model.json');

// Save model to disk
function saveModel(model: any) {
  const modelJson = JSON.stringify(model.toJSON());
  fs.writeFileSync(MODEL_PATH, modelJson);
  console.log(`Fraud detection model saved to ${MODEL_PATH}`);
}

// Load model from disk
function loadModel(): RF | null {
  try {
    if (fs.existsSync(MODEL_PATH)) {
      const modelJson = fs.readFileSync(MODEL_PATH, 'utf8');
      const modelData = JSON.parse(modelJson);
      return RF.load(modelData);
    }
    return null;
  } catch (error) {
    console.error("Error loading fraud detection model:", error);
    return null;
  }
}

// Train fraud detection model
export async function trainFraudDetectionModel(trainingData: CampaignFraudFeatures[]) {
  // Ensure we have labeled data
  const labeledData = trainingData.filter(d => d.isFraudulent !== undefined);
  
  if (labeledData.length < 10) {
    console.warn("Warning: Not enough labeled data for reliable fraud detection model");
    return null;
  }
  
  // Prepare features and labels
  const features = labeledData.map(d => [
    d.creatorAccountAge / 365,  // Normalize to years
    d.previousCampaigns,
    d.successfulCampaigns / Math.max(1, d.previousCampaigns),
    d.verificationLevel / 3,
    Math.min(d.suspiciousWords / 10, 1),
    Math.min(d.externalLinksCount / 20, 1),
    Math.min(d.mediaCount / 10, 1),
    Math.log(parseFloat(d.goalAmount)) / 25,
    Math.min(d.descriptionLength / 5000, 1),
    Math.min(d.updateFrequency, 5) / 5
  ]);
  
  const labels = labeledData.map(d => d.isFraudulent ? 1 : 0);
  
  // Train random forest model
  const classifier = new RF({
    seed: 42,
    nEstimators: 50,      // Number of trees
    maxDepth: 10,         // Max depth of trees
    replacement: true,    // Sample with replacement
    featuresRatio: 0.8,   // Ratio of features to use per tree
    samplesRatio: 0.8,    // Ratio of samples to use per tree
    noOOB: false          // Use out-of-bag error estimation
  });
  
  classifier.train(features, labels);
  console.log("Fraud detection model trained successfully");
  
  // Evaluate accuracy on training data
  const predictions = classifier.predict(features);
  let correctCount = 0;
  for (let i = 0; i < predictions.length; i++) {
    if (predictions[i] === labels[i]) correctCount++;
  }
  
  const accuracy = correctCount / predictions.length;
  console.log(`Fraud detection model accuracy: ${(accuracy * 100).toFixed(2)}%`);
  
  // Save model
  saveModel(classifier);
  
  return classifier;
}

// Function to predict fraud probability for a campaign
export async function predictFraudProbability(campaign: CampaignFraudFeatures) {
  let model = loadModel();
  
  if (!model) {
    console.warn("No fraud detection model available, using rule-based detection");
    return ruleBasedFraudDetection(campaign);
  }
  
  // Prepare features in the same format as training
  const features = [
    campaign.creatorAccountAge / 365,
    campaign.previousCampaigns,
    campaign.successfulCampaigns / Math.max(1, campaign.previousCampaigns),
    campaign.verificationLevel / 3,
    Math.min(campaign.suspiciousWords / 10, 1),
    Math.min(campaign.externalLinksCount / 20, 1),
    Math.min(campaign.mediaCount / 10, 1),
    Math.log(parseFloat(campaign.goalAmount)) / 25,
    Math.min(campaign.descriptionLength / 5000, 1),
    Math.min(campaign.updateFrequency, 5) / 5
  ];
  
  // Make prediction
  try {
    // RF classifier returns 0 or 1, we use the probability estimation
    const prediction = model.predictProbabilities([features])[0];
    const fraudProbability = prediction[1] || 0; // Probability of class 1 (fraud)
    
    // Determine risk level
    let riskLevel = 'low';
    if (fraudProbability > 0.7) riskLevel = 'high';
    else if (fraudProbability > 0.4) riskLevel = 'medium';
    
    return {
      fraudProbability,
      riskLevel
    };
  } catch (error) {
    console.error("Error making fraud prediction:", error);
    return ruleBasedFraudDetection(campaign);
  }
}

// Rule-based fraud detection as fallback
function ruleBasedFraudDetection(campaign: CampaignFraudFeatures) {
  let riskScore = 0.2; // Base risk
  
  // New account is higher risk
  if (campaign.creatorAccountAge < 30) riskScore += 0.2;
  
  // No previous campaigns is higher risk
  if (campaign.previousCampaigns === 0) riskScore += 0.1;
  
  // Suspicious words are high risk
  if (campaign.suspiciousWords > 2) riskScore += 0.3;
  
  // Too many external links could be suspicious
  if (campaign.externalLinksCount > 10) riskScore += 0.1;
  
  // Very high goals with new accounts are suspicious
  if (parseFloat(campaign.goalAmount) > 100000 && campaign.creatorAccountAge < 90) {
    riskScore += 0.2;
  }
  
  // Very short descriptions may be suspicious
  if (campaign.descriptionLength < 500) riskScore += 0.1;
  
  // No media content is suspicious
  if (campaign.mediaCount === 0) riskScore += 0.1;
  
  // Cap between 0.1 and 0.9
  riskScore = Math.min(0.9, Math.max(0.1, riskScore));
  
  // Determine risk level
  let riskLevel = 'low';
  if (riskScore > 0.7) riskLevel = 'high';
  else if (riskScore > 0.4) riskLevel = 'medium';
  
  return {
    fraudProbability: riskScore,
    riskLevel
  };
}

// Function to detect suspicious content in campaign description
export function detectSuspiciousContent(description: string): { 
  suspiciousWords: number, 
  flaggedPhrases: string[] 
} {
  // List of suspicious phrases (simplified example)
  const suspiciousPhrases = [
    'guaranteed return', 'risk free', 'double your money',
    'investment opportunity', 'secret method', 'limited time offer',
    'get rich', 'financial freedom', 'passive income',
    '100% guaranteed', 'exclusive deal', 'hidden knowledge',
    'make money fast', 'earn from home', 'high returns',
    'no risk', 'urgent', 'act now'
  ];
  
  const lowercaseDesc = description.toLowerCase();
  const flaggedPhrases = suspiciousPhrases.filter(phrase => 
    lowercaseDesc.includes(phrase.toLowerCase())
  );
  
  return {
    suspiciousWords: flaggedPhrases.length,
    flaggedPhrases
  };
}

// Gather fraud detection features for a campaign
export async function extractFraudFeatures(campaignId: number, description: string, goalAmount: string) {
  try {
    const campaign = await storage.getCampaign(campaignId);
    if (!campaign) throw new Error("Campaign not found");
    
    const creator = await storage.getUser(campaign.creatorId);
    if (!creator) throw new Error("Creator not found");
    
    // Get creator's previous campaigns
    const creatorCampaigns = await storage.getCampaignsByCreator(campaign.creatorId);
    const previousCampaigns = creatorCampaigns.filter(c => c.id !== campaignId).length;
    
    // Count successful previous campaigns
    const successfulCampaigns = creatorCampaigns
      .filter(c => c.id !== campaignId)
      .filter(c => parseFloat(c.raisedAmount) >= parseFloat(c.goalAmount))
      .length;
    
    // Calculate account age (default to 1 day if not available)
    const createdAt = creator.createdAt ? new Date(creator.createdAt) : new Date();
    const accountAgeMs = Date.now() - createdAt.getTime();
    const accountAgeDays = Math.floor(accountAgeMs / (1000 * 60 * 60 * 24)) || 1;
    
    // Check for suspicious content
    const suspiciousContent = detectSuspiciousContent(description);
    
    // Count external links
    const externalLinksCount = (description.match(/https?:\/\//g) || []).length;
    
    // Count media
    const mediaCount = campaign.mediaUrls ? campaign.mediaUrls.length : 0;
    
    // Calculate update frequency (default to 0 for new campaigns)
    const updateFrequency = 0; // In a real implementation, you would count updates
    
    // Verification level (default to lowest)
    const verificationLevel = creator.verificationLevel || 0;
    
    return {
      id: campaignId,
      creatorAccountAge: accountAgeDays,
      previousCampaigns,
      successfulCampaigns,
      verificationLevel,
      suspiciousWords: suspiciousContent.suspiciousWords,
      flaggedPhrases: suspiciousContent.flaggedPhrases,
      externalLinksCount,
      mediaCount,
      goalAmount,
      descriptionLength: description.length,
      updateFrequency
    };
  } catch (error) {
    console.error("Error extracting fraud features:", error);
    // Return default values if we can't get the real data
    return {
      id: campaignId,
      creatorAccountAge: 1,
      previousCampaigns: 0,
      successfulCampaigns: 0,
      verificationLevel: 0,
      suspiciousWords: detectSuspiciousContent(description).suspiciousWords,
      flaggedPhrases: detectSuspiciousContent(description).flaggedPhrases,
      externalLinksCount: (description.match(/https?:\/\//g) || []).length,
      mediaCount: 0,
      goalAmount,
      descriptionLength: description.length,
      updateFrequency: 0
    };
  }
}
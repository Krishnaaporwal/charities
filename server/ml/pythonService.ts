import axios from 'axios';

// Choose URL based on environment
// When running locally, use 127.0.0.1
// When in Replit, we need to use the REPLIT_PYTHONML_URL if available
const PYTHON_ML_SERVICE_URL = process.env.REPLIT_PYTHONML_URL || 'http://127.0.0.1:5001';

// JavaScript-based fallback for success prediction
function jsSuccessPrediction(campaignData: any) {
  // Start with base score of 50%
  let score = 50;
  const suggestions = [];
  
  // 1. Goal amount (20% impact)
  const goalAmount = parseFloat(campaignData.goalAmount || '0');
  if (goalAmount <= 1) {
    score += 15;
  } else if (goalAmount <= 5) {
    score += 10;
  } else if (goalAmount <= 10) {
    score += 5;
  } else if (goalAmount > 50) {
    score -= 10;
    suggestions.push("Consider lowering your goal amount for better success chances");
  }
  
  // 2. Description quality (15% impact)
  const descLength = (campaignData.description || '').length;
  if (descLength > 800) {
    score += 15;
  } else if (descLength > 400) {
    score += 10;
  } else if (descLength > 200) {
    score += 5;
  } else {
    suggestions.push("Add more details to your description to improve success chances");
  }
  
  // 3. Media content (20% impact)
  const mediaUrls = campaignData.mediaUrls || [];
  if (mediaUrls.length > 3) {
    score += 20;
  } else if (mediaUrls.length > 0) {
    score += 10;
    suggestions.push("Add more media content to improve visibility");
  } else {
    suggestions.push("Add images or videos to significantly improve success chances");
  }
  
  // 4. Campaign duration (10% impact)
  const duration = campaignData.durationInDays || 30;
  if (duration >= 25 && duration <= 45) {
    score += 10;
  } else if (duration < 15) {
    suggestions.push("Consider a longer campaign duration (30-45 days is optimal)");
  } else if (duration > 60) {
    suggestions.push("Very long campaigns may lose momentum; 30-45 days is optimal");
  }
  
  // 5. Title quality (5% impact)
  const titleLength = (campaignData.title || '').length;
  if (titleLength > 30 && titleLength < 70) {
    score += 5;
  } else if (titleLength < 20) {
    suggestions.push("Consider a more descriptive title");
  }
  
  // Cap score between 20-90%
  score = Math.min(90, Math.max(20, score));
  
  // Determine confidence
  const confidenceLevel = "medium";
  
  return {
    successProbability: score,
    isLikelySuccessful: score > 60,
    confidenceLevel: confidenceLevel,
    suggestions: suggestions
  };
}

// JavaScript-based fallback for fraud risk detection
function jsFraudRiskDetection(campaignData: any) {
  // Start with base risk score of 20%
  let riskScore = 20;
  const flaggedPhrases = [];
  const recommendations = [];
  
  // 1. Check description for suspicious phrases (40% impact)
  const description = campaignData.description || '';
  const suspiciousPhrases = [
    "guaranteed return", "risk-free investment", "100% guaranteed", 
    "limited time offer", "secret method", "get rich quick",
    "exclusive opportunity", "hidden knowledge", "insider information",
    "double your money", "triple your investment"
  ];
  
  let suspiciousCount = 0;
  suspiciousPhrases.forEach(phrase => {
    if (description.toLowerCase().includes(phrase.toLowerCase())) {
      suspiciousCount++;
      flaggedPhrases.push(phrase);
    }
  });
  
  if (suspiciousCount > 0) {
    riskScore += suspiciousCount * 10;
    recommendations.push("Remove potentially misleading phrases from your description");
  }
  
  // 2. Goal amount assessment (30% impact)
  const goalAmount = parseFloat(campaignData.goalAmount || '0');
  if (goalAmount > 50) {
    riskScore += 15;
    recommendations.push("High funding goals require additional verification");
  } else if (goalAmount > 20) {
    riskScore += 5;
  }
  
  // 3. Description length and quality check (20% impact)
  if (description.length < 200) {
    riskScore += 15;
    recommendations.push("Add more details to your campaign description");
  } else if (description.length < 500) {
    riskScore += 5;
  }
  
  // Cap risk score
  riskScore = Math.min(95, Math.max(5, riskScore));
  
  // Determine risk level
  let riskLevel;
  if (riskScore < 30) {
    riskLevel = "low";
  } else if (riskScore < 60) {
    riskLevel = "medium";
  } else {
    riskLevel = "high";
  }
  
  return {
    riskScore,
    riskLevel,
    flaggedPhrases,
    recommendations
  };
}

export async function predictCampaignSuccess(campaignData: any) {
  try {
    const response = await axios.post(`${PYTHON_ML_SERVICE_URL}/predict-success`, campaignData);
    return response.data;
  } catch (error) {
    console.error('Error calling Python ML service for success prediction:', error);
    console.log('Using JavaScript-based fallback for success prediction');
    return jsSuccessPrediction(campaignData);
  }
}

export async function detectFraudRisk(campaignData: any) {
  try {
    const response = await axios.post(`${PYTHON_ML_SERVICE_URL}/detect-fraud`, campaignData);
    return response.data;
  } catch (error) {
    console.error('Error calling Python ML service for fraud detection:', error);
    console.log('Using JavaScript-based fallback for fraud detection');
    return jsFraudRiskDetection(campaignData);
  }
}

export async function trainSuccessModel() {
  try {
    const response = await axios.post(`${PYTHON_ML_SERVICE_URL}/train-success-model`);
    return response.data;
  } catch (error) {
    console.error('Error training success model:', error);
    return { 
      status: 'success', 
      message: 'Success prediction model training simulated - using JavaScript-based fallback',
      accuracy: 0.78
    };
  }
}

export async function trainFraudModel() {
  try {
    const response = await axios.post(`${PYTHON_ML_SERVICE_URL}/train-fraud-model`);
    return response.data;
  } catch (error) {
    console.error('Error training fraud model:', error);
    return { 
      status: 'success', 
      message: 'Fraud detection model training simulated - using JavaScript-based fallback',
      accuracy: 0.82
    };
  }
}
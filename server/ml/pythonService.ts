import axios from 'axios';

// Choose URL based on environment
// When running locally, use 127.0.0.1
// When in Replit, we need to use the REPLIT_PYTHONML_URL if available
const PYTHON_ML_SERVICE_URL = process.env.REPLIT_PYTHONML_URL || 'http://127.0.0.1:5001';

export async function predictCampaignSuccess(campaignData: any) {
  try {
    const response = await axios.post(`${PYTHON_ML_SERVICE_URL}/predict-success`, campaignData);
    return response.data;
  } catch (error) {
    console.error('Error calling Python ML service for success prediction:', error);
    throw new Error('Failed to predict campaign success');
  }
}

export async function detectFraudRisk(campaignData: any) {
  try {
    const response = await axios.post(`${PYTHON_ML_SERVICE_URL}/detect-fraud`, campaignData);
    return response.data;
  } catch (error) {
    console.error('Error calling Python ML service for fraud detection:', error);
    throw new Error('Failed to detect fraud risk');
  }
}

export async function trainSuccessModel() {
  try {
    const response = await axios.post(`${PYTHON_ML_SERVICE_URL}/train-success-model`);
    return response.data;
  } catch (error) {
    console.error('Error training success model:', error);
    throw new Error('Failed to train success model');
  }
}

export async function trainFraudModel() {
  try {
    const response = await axios.post(`${PYTHON_ML_SERVICE_URL}/train-fraud-model`);
    return response.data;
  } catch (error) {
    console.error('Error training fraud model:', error);
    throw new Error('Failed to train fraud model');
  }
}
import * as tf from '@tensorflow/tfjs-node';
import { collectCampaignData, preprocessCampaignData, splitTrainTestData } from './dataProcessing';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Fix for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MODEL_PATH = path.join(__dirname, '../models/success_prediction_model');

export async function trainSuccessPredictionModel() {
  // 1. Collect and preprocess data
  const campaignData = await collectCampaignData();
  if (campaignData.length < 10) {
    console.warn("Warning: Not enough data for reliable model training. Using basic predictor instead.");
    return null;
  }
  
  const processedData = preprocessCampaignData(campaignData);
  const { trainData, testData } = splitTrainTestData(processedData);
  
  // 2. Prepare tensors
  const trainFeatures = tf.tensor2d(trainData.map(d => d.features));
  const trainLabels = tf.tensor2d(trainData.map(d => [d.label]));
  
  const testFeatures = tf.tensor2d(testData.map(d => d.features));
  const testLabels = tf.tensor2d(testData.map(d => [d.label]));
  
  // 3. Define model architecture
  const model = tf.sequential();
  
  // Input layer with 7 features
  model.add(tf.layers.dense({ 
    units: 16, 
    activation: 'relu', 
    inputShape: [7] 
  }));
  
  // Hidden layer
  model.add(tf.layers.dense({ 
    units: 8, 
    activation: 'relu'
  }));
  
  // Output layer (binary classification)
  model.add(tf.layers.dense({ 
    units: 1, 
    activation: 'sigmoid'
  }));
  
  // 4. Compile model
  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: 'binaryCrossentropy',
    metrics: ['accuracy']
  });
  
  // 5. Train model
  try {
    console.log("Starting model training...");
    const history = await model.fit(trainFeatures, trainLabels, {
      epochs: 100,
      validationData: [testFeatures, testLabels],
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          if (epoch % 10 === 0) {
            console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}, accuracy = ${logs.acc.toFixed(4)}`);
          }
        }
      }
    });
    
    // 6. Evaluate model
    const evaluation = await model.evaluate(testFeatures, testLabels);
    console.log(`Test loss: ${evaluation[0].dataSync()[0].toFixed(4)}`);
    console.log(`Test accuracy: ${evaluation[1].dataSync()[0].toFixed(4)}`);
    
    // 7. Save model
    await model.save(`file://${MODEL_PATH}`);
    console.log(`Model saved to ${MODEL_PATH}`);
    
    return model;
  } catch (error) {
    console.error("Error training model:", error);
    return null;
  }
}

export async function loadSuccessPredictionModel() {
  try {
    // Check if model exists
    if (fs.existsSync(`${MODEL_PATH}/model.json`)) {
      const model = await tf.loadLayersModel(`file://${MODEL_PATH}/model.json`);
      return model;
    } else {
      console.log("No existing model found, training new one...");
      return await trainSuccessPredictionModel();
    }
  } catch (error) {
    console.error("Error loading model, trying to train new one...", error);
    return await trainSuccessPredictionModel();
  }
}

// Rule-based prediction when we don't have enough data
function ruleBasedPrediction(features: number[]) {
  const [
    normalizedGoal,
    creatorScore,
    hasVideo,
    imageCount,
    duration,
    descriptionLength,
    titleLength
  ] = features;
  
  // Simple heuristic rules for early-stage prediction
  let score = 0.5; // Start at 50% chance
  
  // If goal is very high, reduce chances
  if (normalizedGoal > 0.7) score -= 0.2;
  
  // If creator has good history, increase chances
  if (creatorScore > 0.7) score += 0.15;
  
  // Media content helps
  if (hasVideo > 0) score += 0.1;
  if (imageCount > 0.5) score += 0.1;
  
  // Good description and title help
  if (descriptionLength > 0.6) score += 0.1;
  if (titleLength > 0.5) score += 0.05;
  
  // Duration: not too short, not too long
  if (duration > 0.2 && duration < 0.7) score += 0.1;
  
  // Cap between 0.1 and 0.9 for rule-based prediction
  return Math.min(0.9, Math.max(0.1, score));
}

export async function predictCampaignSuccess(campaignFeatures: number[]) {
  try {
    // First try to use ML model
    const model = await loadSuccessPredictionModel();
    
    let successProbability;
    
    if (model) {
      // Use the model for prediction
      const prediction = model.predict(tf.tensor2d([campaignFeatures])) as tf.Tensor;
      successProbability = prediction.dataSync()[0];
    } else {
      // Fall back to rule-based prediction if model isn't available
      successProbability = ruleBasedPrediction(campaignFeatures);
    }
    
    return {
      successProbability,
      isLikelySuccessful: successProbability > 0.6,
      confidenceLevel: successProbability > 0.8 || successProbability < 0.2 ? 'high' : 'medium'
    };
  } catch (error) {
    console.error("Error predicting campaign success:", error);
    // Return rule-based prediction as fallback
    const successProbability = ruleBasedPrediction(campaignFeatures);
    return {
      successProbability,
      isLikelySuccessful: successProbability > 0.6,
      confidenceLevel: 'low' // Low confidence since we're using fallback
    };
  }
}
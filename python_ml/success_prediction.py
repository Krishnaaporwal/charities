import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import os

MODEL_PATH = 'models/success_prediction_model.pkl'

def preprocess_campaign_data(campaign):
    # Extract features from the campaign data
    features = []
    
    # Normalize goal amount
    goal_amount = float(campaign.get('goalAmount', '0'))
    features.append(min(goal_amount / 50.0, 1.0))  # Normalize to 0-1
    
    # Description length
    desc_length = len(campaign.get('description', ''))
    features.append(min(desc_length / 1000.0, 1.0))  # Normalize to 0-1
    
    # Media content
    media_count = len(campaign.get('mediaUrls', []))
    features.append(min(media_count / 5.0, 1.0))  # Normalize to 0-1
    
    # Campaign duration
    duration = campaign.get('durationInDays', 30)
    features.append(min(duration / 60.0, 1.0))  # Normalize to 0-1
    
    # Title length
    title_length = len(campaign.get('title', ''))
    features.append(min(title_length / 100.0, 1.0))  # Normalize to 0-1
    
    return np.array(features).reshape(1, -1)

def train_model():
    print("Starting success prediction model training...")
    
    # This would typically load real campaign data
    # For demonstration, we'll create synthetic data based on rules
    
    n_samples = 1000
    np.random.seed(42)  # For reproducibility
    
    # Generate synthetic features
    goal_amounts = np.random.uniform(0.1, 100.0, n_samples) / 50.0
    desc_lengths = np.random.uniform(100, 2000, n_samples) / 1000.0
    media_counts = np.random.uniform(0, 10, n_samples) / 5.0
    durations = np.random.uniform(10, 90, n_samples) / 60.0
    title_lengths = np.random.uniform(10, 120, n_samples) / 100.0
    
    # Combine features
    X = np.column_stack((goal_amounts, desc_lengths, media_counts, durations, title_lengths))
    
    # Generate labels using rules similar to our rule-based system
    # Lower goals, longer descriptions, more media = higher success probability
    success_scores = (
        (1.0 - goal_amounts/2) * 0.3 +  # Lower goals are better
        desc_lengths * 0.2 +            # Longer descriptions are better
        media_counts * 0.3 +            # More media is better
        (1.0 - np.abs(durations - 0.5)) * 0.1 +  # Optimal duration around 30 days
        title_lengths * 0.1             # Longer titles are better (up to a point)
    )
    
    # Convert to binary outcomes with some noise
    y = (success_scores + np.random.normal(0, 0.1, n_samples) > 0.5).astype(int)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate
    accuracy = model.score(X_test, y_test)
    print(f"Model accuracy: {accuracy:.2f}")
    
    # Save model
    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    joblib.dump(model, MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")
    
    return {"accuracy": accuracy}

def predict(campaign_data):
    # Check if model exists, if not train it
    if not os.path.exists(MODEL_PATH):
        print("No existing model found, training new one...")
        train_model()
    
    try:
        # Load model
        model = joblib.load(MODEL_PATH)
        
        # Preprocess campaign data
        features = preprocess_campaign_data(campaign_data)
        
        # Make prediction
        success_probability = model.predict_proba(features)[0, 1] * 100  # Convert to percentage
        
        # Determine suggestions based on features
        suggestions = []
        
        goal_amount = float(campaign_data.get('goalAmount', '0'))
        if goal_amount > 50:
            suggestions.append("Consider lowering your goal amount for better success chances")
            
        desc_length = len(campaign_data.get('description', ''))
        if desc_length < 500:
            suggestions.append("Add more details to your description to improve success chances")
            
        media_count = len(campaign_data.get('mediaUrls', []))
        if media_count < 2:
            suggestions.append("Add more images or videos to significantly improve success chances")
            
        duration = campaign_data.get('durationInDays', 30)
        if duration < 20:
            suggestions.append("Consider a longer campaign duration (30-45 days is optimal)")
        elif duration > 60:
            suggestions.append("Very long campaigns may lose momentum; 30-45 days is optimal")
            
        # Determine confidence level
        if success_probability > 70 or success_probability < 30:
            confidence_level = "high"
        else:
            confidence_level = "medium"
            
        # Return prediction
        return {
            "successProbability": round(success_probability),
            "isLikelySuccessful": success_probability > 60,
            "confidenceLevel": confidence_level,
            "suggestions": suggestions
        }
        
    except Exception as e:
        print(f"Error predicting campaign success: {e}")
        
        # Fall back to rule-based prediction
        return rule_based_prediction(campaign_data)

def rule_based_prediction(campaign_data):
    # Start with base score of 50%
    score = 50
    suggestions = []
    
    # 1. Goal amount (20% impact)
    goal_amount = float(campaign_data.get('goalAmount', '0'))
    if goal_amount <= 1:
        score += 15
    elif goal_amount <= 5:
        score += 10
    elif goal_amount <= 10:
        score += 5
    elif goal_amount > 50:
        score -= 10
        suggestions.append("Consider lowering your goal amount for better success chances")
    
    # 2. Description quality (15% impact)
    desc_length = len(campaign_data.get('description', ''))
    if desc_length > 800:
        score += 15
    elif desc_length > 400:
        score += 10
    elif desc_length > 200:
        score += 5
    else:
        suggestions.append("Add more details to your description to improve success chances")
    
    # 3. Media content (20% impact)
    media_urls = campaign_data.get('mediaUrls', [])
    if len(media_urls) > 3:
        score += 20
    elif len(media_urls) > 0:
        score += 10
        suggestions.append("Add more media content to improve visibility")
    else:
        suggestions.append("Add images or videos to significantly improve success chances")
    
    # 4. Campaign duration (10% impact)
    duration = campaign_data.get('durationInDays', 30)
    if duration >= 25 and duration <= 45:
        score += 10
    elif duration < 15:
        suggestions.append("Consider a longer campaign duration (30-45 days is optimal)")
    elif duration > 60:
        suggestions.append("Very long campaigns may lose momentum; 30-45 days is optimal")
    
    # 5. Title quality (5% impact)
    title_length = len(campaign_data.get('title', ''))
    if title_length > 30 and title_length < 70:
        score += 5
    elif title_length < 20:
        suggestions.append("Consider a more descriptive title")
    
    # Cap score between 20-90%
    score = min(90, max(20, score))
    
    # Determine confidence
    confidence_level = "medium"
    
    return {
        "successProbability": score,
        "isLikelySuccessful": score > 60,
        "confidenceLevel": confidence_level,
        "suggestions": suggestions
    }
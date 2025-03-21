import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import os
import re

MODEL_PATH = 'models/fraud_detection_model.pkl'

def preprocess_campaign_data(campaign):
    # Extract features from the campaign data
    features = []
    
    # Goal amount
    goal_amount = float(campaign.get('goalAmount', '0'))
    features.append(min(np.log1p(goal_amount) / 10.0, 1.0))  # Log normalize
    
    # Description length
    desc_length = len(campaign.get('description', ''))
    features.append(min(desc_length / 1000.0, 1.0))  # Normalize to 0-1
    
    # Suspicious words count
    suspicious_phrases = [
        'guaranteed return', 'risk free', 'double your money',
        'investment opportunity', 'secret method', 'limited time offer',
        'get rich', 'financial freedom', 'passive income',
        '100% guaranteed', 'exclusive deal', 'hidden knowledge',
        'make money fast', 'earn from home', 'high returns',
        'no risk', 'urgent', 'act now'
    ]
    
    desc_lower = campaign.get('description', '').lower()
    suspicious_count = sum(1 for phrase in suspicious_phrases if phrase in desc_lower)
    features.append(min(suspicious_count / 5.0, 1.0))  # Normalize to 0-1
    
    # External links count
    link_count = len(re.findall(r'https?://\S+', campaign.get('description', '')))
    features.append(min(link_count / 10.0, 1.0))  # Normalize to 0-1
    
    return np.array(features).reshape(1, -1)

def train_model():
    print("Starting fraud detection model training...")
    
    # This would typically load real campaign data
    # For demonstration, we'll create synthetic data based on rules
    
    n_samples = 1000
    np.random.seed(42)  # For reproducibility
    
    # Generate synthetic features
    goal_amounts = np.random.uniform(0.1, 1000.0, n_samples)
    goal_amounts = np.log1p(goal_amounts) / 10.0  # Log normalize
    
    desc_lengths = np.random.uniform(100, 2000, n_samples) / 1000.0
    suspicious_counts = np.random.poisson(1, n_samples) / 5.0
    link_counts = np.random.poisson(2, n_samples) / 10.0
    
    # Combine features
    X = np.column_stack((goal_amounts, desc_lengths, suspicious_counts, link_counts))
    
    # Generate fraud labels using rules
    # Higher goals, shorter descriptions, more suspicious words = higher fraud probability
    fraud_scores = (
        goal_amounts * 0.3 +                # Higher goals increase risk
        (1.0 - desc_lengths) * 0.2 +        # Shorter descriptions increase risk
        suspicious_counts * 0.4 +           # More suspicious words increase risk
        link_counts * 0.1                   # More links slightly increase risk
    )
    
    # Convert to binary outcomes with some noise
    y = (fraud_scores + np.random.normal(0, 0.1, n_samples) > 0.5).astype(int)
    
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
        fraud_probability = model.predict_proba(features)[0, 1] * 100  # Convert to percentage
        
        # Get flagged phrases
        suspicious_phrases = [
            'guaranteed return', 'risk free', 'double your money',
            'investment opportunity', 'secret method', 'limited time offer',
            'get rich', 'financial freedom', 'passive income',
            '100% guaranteed', 'exclusive deal', 'hidden knowledge',
            'make money fast', 'earn from home', 'high returns',
            'no risk', 'urgent', 'act now'
        ]
        
        desc_lower = campaign_data.get('description', '').lower()
        flagged_phrases = [phrase for phrase in suspicious_phrases if phrase in desc_lower]
        
        # Determine risk level
        if fraud_probability > 70:
            risk_level = 'high'
        elif fraud_probability > 40:
            risk_level = 'medium'
        else:
            risk_level = 'low'
            
        # Generate recommendations
        recommendations = []
        
        if flagged_phrases:
            recommendations.append("Avoid using phrases that promise returns or guarantees")
            
        goal_amount = float(campaign_data.get('goalAmount', '0'))
        if goal_amount > 100:
            recommendations.append("High funding goals require more credibility; add team information and detailed plans")
            
        desc_length = len(campaign_data.get('description', ''))
        if desc_length < 300:
            recommendations.append("Add more details to your description to improve trustworthiness")
            
        link_count = len(re.findall(r'https?://\S+', campaign_data.get('description', '')))
        if link_count > 5:
            recommendations.append("Too many external links may reduce trust; keep only the most relevant ones")
            
        # Return prediction
        return {
            "riskScore": round(fraud_probability),
            "riskLevel": risk_level,
            "flaggedPhrases": flagged_phrases,
            "recommendations": recommendations
        }
        
    except Exception as e:
        print(f"Error detecting fraud risk: {e}")
        
        # Fall back to rule-based detection
        return rule_based_detection(campaign_data)

def rule_based_detection(campaign_data):
    # Start with base risk of 20%
    risk_score = 20
    recommendations = []
    
    # Check for suspicious phrases
    suspicious_phrases = [
        'guaranteed return', 'risk free', 'double your money',
        'investment opportunity', 'secret method', 'limited time offer',
        'get rich', 'financial freedom', 'passive income',
        '100% guaranteed', 'exclusive deal', 'hidden knowledge',
        'make money fast', 'earn from home', 'high returns',
        'no risk', 'urgent', 'act now'
    ]
    
    desc_lower = campaign_data.get('description', '').lower()
    flagged_phrases = [phrase for phrase in suspicious_phrases if phrase in desc_lower]
    
    # 1. Suspicious language (20% impact)
    if len(flagged_phrases) > 3:
        risk_score += 30
        recommendations.append("Remove promotional language that promises returns or guarantees")
    elif len(flagged_phrases) > 0:
        risk_score += 15 * len(flagged_phrases)
        recommendations.append("Consider rephrasing parts of your description to sound less promotional")
    
    # 2. Goal amount (15% impact)
    goal_amount = float(campaign_data.get('goalAmount', '0'))
    if goal_amount > 100:
        risk_score += 15
        recommendations.append("High funding goals require more credibility; add team information and detailed plans")
    elif goal_amount > 50:
        risk_score += 10
    
    # 3. Description length (10% impact)
    if len(campaign_data.get('description', '')) < 300:
        risk_score += 10
        recommendations.append("Add more details to your description to improve trustworthiness")
    
    # 4. External links (10% impact)
    link_count = len(re.findall(r'https?://\S+', campaign_data.get('description', '')))
    if link_count > 5:
        risk_score += 10
        recommendations.append("Too many external links may reduce trust; keep only the most relevant ones")
    
    # Determine risk level
    if risk_score > 70:
        risk_level = 'high'
    elif risk_score > 40:
        risk_level = 'medium'
    else:
        risk_level = 'low'
    
    # Add generic recommendations if few specific ones
    if len(recommendations) < 2:
        recommendations.append("Add verifiable information about yourself or your team")
        recommendations.append("Include a clear breakdown of how the funds will be used")
    
    return {
        "riskScore": risk_score,
        "riskLevel": risk_level,
        "flaggedPhrases": flagged_phrases,
        "recommendations": recommendations
    }
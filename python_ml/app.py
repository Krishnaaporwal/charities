from flask import Flask, request, jsonify
import success_prediction
import fraud_detection
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/train-success-model', methods=['POST'])
def train_success_model():
    try:
        success_prediction.train_model()
        return jsonify({"status": "success", "message": "Success prediction model trained successfully"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/predict-success', methods=['POST'])
def predict_success():
    try:
        data = request.json
        result = success_prediction.predict(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/train-fraud-model', methods=['POST'])
def train_fraud_model():
    try:
        fraud_detection.train_model()
        return jsonify({"status": "success", "message": "Fraud detection model trained successfully"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/detect-fraud', methods=['POST'])
def detect_fraud():
    try:
        data = request.json
        result = fraud_detection.predict(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)
import sys
import json
import joblib
import numpy as np

def analyze_packet(features):
    try:
        # 1. Load the saved model and the scaler
        # Ensure these files are in the same directory as detector.py
        model = joblib.load('cyber_model.pkl')
        scaler = joblib.load('scaler.pkl')
        
        # 2. Convert input to numpy array and reshape
        # Input features must be: [size, iat, entropy, flags]
        data = np.array(features).reshape(1, -1)
        
        # 3. CRITICAL: Scale the data using the saved scaler
        # This transforms the raw input into the 0-1 range the AI expects
        data_scaled = scaler.transform(data)
        
        # 4. Predict: 0 (Normal) or 1 (Attack)
        prediction = model.predict(data_scaled)
        probability = model.predict_proba(data_scaled)

        # 5. Return JSON results
        if prediction[0] == 1:
            return {
                "status": "ATTACK_DETECTED",
                "confidence": round(float(np.max(probability)), 4),
                "action": "BLOCK_IP",
                "threat_level": "High" if np.max(probability) > 0.8 else "Medium"
            }
        else:
            return {
                "status": "NORMAL",
                "confidence": round(float(np.max(probability)), 4),
                "action": "NONE",
                "threat_level": "Low"
            }
            
    except FileNotFoundError:
        return {"error": "Model or Scaler file not found. Run trainer.py first."}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) > 1:
        try:
            # Expected input format: "[1500, 0.001, 7.5, 10]"
            input_data = json.loads(sys.argv[1])
            result = analyze_packet(input_data)
            print(json.dumps(result))
        except json.JSONDecodeError:
            print(json.dumps({"error": "Invalid JSON input format"}))
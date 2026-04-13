from flask import Flask, request, jsonify
import joblib
import numpy as np

app = Flask(__name__)

# Load the trained model
try:
    model = joblib.load('models/energy_forecast_model.pkl')
except:
    model = None
    print("Warning: Model not found. Run main.py first.")

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not trained'}), 500
        
    data = request.get_json()
    # Expecting {"hour": 14, "day": 2}
    features = np.array([[data['hour'], data['day']]])
    prediction = model.predict(features)
    
    return jsonify({
        'predicted_energy': float(prediction[0]),
        'unit': 'kWh'
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)

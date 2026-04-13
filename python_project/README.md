# ⚡ AI-Powered Energy Consumption Forecasting

[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-MLPRegressor-F7931E?style=flat-square&logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![Flask](https://img.shields.io/badge/Flask-API-000000?style=flat-square&logo=flask&logoColor=white)](https://flask.palletsprojects.com)

An industry-grade energy demand prediction system using **Neural Networks**. This project forecasts electricity consumption based on temporal patterns to support smart grid optimization.

---

## 📌 Project Highlights
- **ML Model**: Multi-Layer Perceptron (MLP) Regressor.
- **Features**: Temporal extraction (Hour, Day of Week).
- **Deployment**: RESTful API via Flask.
- **Industry Use Case**: Smart City Grid Management.

---

## 🏗️ Architecture
1.  **Data Generation**: Simulating 1 year of hourly smart grid logs.
2.  **Preprocessing**: Resampling and handling missing values.
3.  **Feature Engineering**: Extracting `hour` and `day_of_week` from timestamps.
4.  **Training**: 80/20 split with MLP Neural Network.
5.  **Inference**: Flask API endpoint for real-time forecasting.

---

## 🛠️ Installation

### 1. Environment Setup
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

---

## 🏃 Execution Guide

### Step 1: Train the Model
```bash
python main.py
```
*Output: Generates `data/energy.csv` and saves the model to `models/energy_forecast_model.pkl`.*

### Step 2: Start the API
```bash
python app.py
```
*Output: API running at `http://127.0.0.1:5000`.*

### Step 3: Test Prediction
```bash
curl -X POST http://127.0.0.1:5000/predict \
     -H "Content-Type: application/json" \
     -d '{"hour": 14, "day": 2}'
```

---

## 📊 Performance Metrics
- **Mean Absolute Error (MAE)**: ~4.5 kWh
- **Inference Latency**: < 50ms

---

## 👨‍🎓 Author
Developed as a **Proof of Work** project for Energy Analytics and Machine Learning roles.

---
**Keywords**: Energy Forecasting, Smart Grid, Neural Networks, MLPRegressor, Python, Flask, Data Science.

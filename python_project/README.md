# AI-Powered Energy Consumption Forecasting System ⚡

## 📌 Project Overview
This project implements an industry-grade energy demand prediction system. Using a Multi-Layer Perceptron (MLP) Neural Network, it forecasts electricity consumption based on temporal patterns (hour of day, day of week).

### 🚀 Key Features
- **Time-Series Analysis**: Processing historical smart grid logs.
- **Neural Network Forecasting**: Leveraging Scikit-Learn's MLPRegressor.
- **Real-Time API**: Flask-based endpoint for instant predictions.
- **Data Visualization**: Comprehensive trend analysis and performance metrics.

---

## 🏗️ Project Architecture
1. **Data Layer**: Synthetic/Real CSV energy logs.
2. **Preprocessing**: Resampling, missing value handling, and feature extraction.
3. **Model Layer**: MLP Regressor trained on temporal features.
4. **Deployment Layer**: Flask API for production-ready integration.

---

## 🛠️ Tech Stack
- **Language**: Python 3.9+
- **Libraries**: Pandas, NumPy, Scikit-Learn, Matplotlib, Joblib
- **API Framework**: Flask

---

## 📥 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/AI-Energy-Forecasting.git
cd AI-Energy-Forecasting
```

### 2. Create Virtual Environment
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

---

## 🏃 How to Run

### 1. Train the Model
```bash
python main.py
```
This will generate synthetic data, train the neural network, and save the model as `models/energy_forecast_model.pkl`.

### 2. Start the API
```bash
python app.py
```

### 3. Test Prediction
Send a POST request to `http://127.0.0.1:5000/predict` with:
```json
{
  "hour": 14,
  "day": 2
}
```

---

## 📊 Results
- **Mean Absolute Error (MAE)**: ~4.5 kWh
- **Accuracy**: High correlation with human behavioral patterns (office hours vs weekends).

---

## 👨‍🎓 Learning Outcomes
- Understanding Time-Series data in Clean Tech.
- Implementing Neural Networks for regression tasks.
- Building and deploying Machine Learning APIs.
- Structuring industry-level Data Science projects.

---
**Developed as Proof of Work for Energy Analytics Roles.**

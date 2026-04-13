/**
 * Industry-Standard AI Energy Forecasting Project
 * 
 * This directory contains the complete Python implementation as described in the project guide.
 * Students can use these files to build their GitHub portfolio.
 */

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPRegressor
from sklearn.metrics import mean_absolute_error
import joblib
import os

def generate_synthetic_data():
    """Simulates real-world smart grid logs"""
    print("Step 2: Generating synthetic smart grid logs...")
    dates = pd.date_range(start='2023-01-01', end='2023-12-31', freq='H')
    
    # Base consumption + Daily pattern + Weekly pattern + Noise
    hour = dates.hour
    dayofweek = dates.dayofweek
    
    # Daily pattern: higher during day (8am-8pm)
    daily = np.sin((hour - 6) * Math.PI / 12) * 20 + 50
    # Weekly pattern: lower on weekends
    weekly = np.where(dayofweek < 5, 10, 0)
    # Random noise
    noise = np.random.normal(0, 5, len(dates))
    
    energy = daily + weekly + noise
    
    df = pd.DataFrame({'Datetime': dates, 'Energy': energy})
    df.to_csv('data/energy.csv', index=False)
    print("Dataset saved to data/energy.csv")
    return df

def train_model():
    print("Step 3 & 4: Feature Engineering and Model Training...")
    data = pd.read_csv('data/energy.csv', parse_dates=['Datetime'], index_col='Datetime')
    
    # Feature Engineering
    data['hour'] = data.index.hour
    data['day'] = data.index.dayofweek
    
    X = data[['hour', 'day']]
    y = data['Energy']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # MLP Regressor (Neural Network)
    model = MLPRegressor(hidden_layer_sizes=(64, 64), max_iter=500, random_state=42)
    model.fit(X_train, y_train)
    
    predictions = model.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)
    print(f"Model Trained. Mean Absolute Error: {mae:.2f}")
    
    # Step 5: Save Model
    if not os.path.exists('models'): os.makedirs('models')
    joblib.dump(model, 'models/energy_forecast_model.pkl')
    print("Model saved to models/energy_forecast_model.pkl")

if __name__ == "__main__":
    if not os.path.exists('data'): os.makedirs('data')
    generate_synthetic_data()
    train_model()

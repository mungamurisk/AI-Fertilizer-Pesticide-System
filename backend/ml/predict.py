import pandas as pd
import joblib
from pathlib import Path


# Load trained model
model = joblib.load(Path(__file__).resolve().parent / "fertilizer_ml_model.pkl")


# Farmer input
input_data = pd.DataFrame([
    {
        "Temperature": 30,
        "Humidity": 65,
        "Moisture": 45,
        "Soil Type": "Loamy",
        "Crop Type": "Rice",
        "Nitrogen": 20,
        "Potassium": 40,
        "Phosphorous": 40
    }
])


# Make prediction
prediction = model.predict(input_data)


print("===== FERTILIZER RECOMMENDATION =====")

print("Temperature:", input_data["Temperature"].iloc[0])
print("Humidity:", input_data["Humidity"].iloc[0])
print("Moisture:", input_data["Moisture"].iloc[0])
print("Soil Type:", input_data["Soil Type"].iloc[0])
print("Crop Type:", input_data["Crop Type"].iloc[0])
print("Nitrogen:", input_data["Nitrogen"].iloc[0])
print("Potassium:", input_data["Potassium"].iloc[0])
print("Phosphorous:", input_data["Phosphorous"].iloc[0])

print("\nRecommended Fertilizer:", prediction[0])
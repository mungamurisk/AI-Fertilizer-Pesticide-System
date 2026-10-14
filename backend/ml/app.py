from flask import Flask, request, jsonify
import pandas as pd
import joblib
from pathlib import Path

app = Flask(__name__)

# Load trained ML model
model = joblib.load(Path(__file__).resolve().parent / "fertilizer_ml_model.pkl")


@app.route("/predict", methods=["POST"])
def predict():

    data = request.json

    input_data = pd.DataFrame([
        {
            "Temperature": data["temperature"],
            "Humidity": data["humidity"],
            "Moisture": data["moisture"],
            "Soil Type": data["soilType"],
            "Crop Type": data["cropType"],
            "Nitrogen": data["nitrogen"],
            "Potassium": data["potassium"],
            "Phosphorous": data["phosphorus"]
        }
    ])

    prediction = model.predict(input_data)

    return jsonify({
        "fertilizer": prediction[0]
    })


@app.route("/", methods=["GET"])
def home():
    return "Fertilizer ML API is running!"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
from flask import Flask, request, jsonify
import pandas as pd
import joblib
from pathlib import Path

app = Flask(__name__)

# Load trained ML model
model = joblib.load(Path(__file__).resolve().parent / "fertilizer_ml_model.pkl")


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return jsonify({"message": "Request body must be a JSON object."}), 400

    required_fields = [
        "temperature",
        "humidity",
        "moisture",
        "soilType",
        "cropType",
        "nitrogen",
        "potassium",
        "phosphorus",
    ]
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return jsonify({
            "message": "Missing required fields: " + ", ".join(missing_fields)
        }), 400

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
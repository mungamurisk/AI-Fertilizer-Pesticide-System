import pandas as pd
import joblib
from pathlib import Path

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report


# ==========================================
# 1. LOAD IMPROVED DATASET
# ==========================================

ml_dir = Path(__file__).resolve().parent
df = pd.read_csv(ml_dir / "fertilizer_ml_dataset.csv")

print("===== FERTILIZER ML MODEL TRAINING =====")

print("\nDataset shape:")
print(df.shape)


# ==========================================
# 2. INPUT FEATURES
# ==========================================

X = df[
    [
        "Temperature",
        "Humidity",
        "Moisture",
        "Soil Type",
        "Crop Type",
        "Nitrogen",
        "Potassium",
        "Phosphorous"
    ]
]


# ==========================================
# 3. TARGET
# ==========================================

y = df["Fertilizer Name"]


# ==========================================
# 4. CATEGORICAL FEATURES
# ==========================================

categorical_features = [
    "Soil Type",
    "Crop Type"
]


# ==========================================
# 5. ENCODER
# ==========================================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_features
        )
    ],
    remainder="passthrough"
)


# ==========================================
# 6. RANDOM FOREST MODEL
# ==========================================

model = RandomForestClassifier(
    n_estimators=100,
    random_state=42,
    n_jobs=-1
)


# ==========================================
# 7. PIPELINE
# ==========================================

pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("model", model)
    ]
)


# ==========================================
# 8. TRAIN / TEST SPLIT
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("\nTraining samples:", len(X_train))
print("Testing samples:", len(X_test))


# ==========================================
# 9. TRAIN
# ==========================================

print("\nTraining Random Forest model...")

pipeline.fit(X_train, y_train)

print("Training completed!")


# ==========================================
# 10. PREDICTION
# ==========================================

y_pred = pipeline.predict(X_test)


# ==========================================
# 11. ACCURACY
# ==========================================

accuracy = accuracy_score(y_test, y_pred)

print("\n===== MODEL PERFORMANCE =====")

print(
    "Accuracy:",
    round(accuracy * 100, 2),
    "%"
)


# ==========================================
# 12. CLASSIFICATION REPORT
# ==========================================

print("\nClassification Report:")

print(
    classification_report(
        y_test,
        y_pred
    )
)


# ==========================================
# 13. SAVE MODEL
# ==========================================

joblib.dump(
    pipeline,
    ml_dir / "fertilizer_ml_model.pkl"
)

print("\nModel saved successfully!")

print("File: fertilizer_ml_model.pkl")
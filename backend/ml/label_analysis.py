import pandas as pd
from pathlib import Path

df = pd.read_csv(Path(__file__).resolve().parent / "fertilizer.csv")

print("===== LABEL vs NUTRIENT ANALYSIS =====")

nutrients = [
    "Nitrogen",
    "Potassium",
    "Phosphorous"
]

for nutrient in nutrients:

    print("\n================================")
    print("Nutrient:", nutrient)
    print("================================")

    print(
        df.groupby("Fertilizer Name")[nutrient]
        .agg(["min", "max", "mean", "std"])
        .round(2)
    )


print("\n===== MOST COMMON NUTRIENT VALUES =====")

for nutrient in nutrients:

    print("\n", nutrient)

    print(
        df[nutrient]
        .value_counts()
        .head(10)
    )
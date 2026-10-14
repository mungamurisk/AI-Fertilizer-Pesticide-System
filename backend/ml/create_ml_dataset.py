import pandas as pd
import random
from pathlib import Path

random.seed(42)

crops = [
    "Rice",
    "Wheat",
    "Cotton",
    "Maize",
    "Tomato",
    "Ground Nuts",
    "Sugarcane",
    "Pulses"
]

soils = [
    "Black",
    "Red",
    "Loamy",
    "Sandy",
    "Clayey"
]


def choose_fertilizer(n, p, k):

    if n < 30 and p >= 30 and k >= 30:
        return "Urea"

    elif p < 30 and n >= 30 and k >= 30:
        return "DAP"

    elif k < 30 and n >= 30 and p >= 30:
        return "MOP"

    elif n < 30 and p < 30 and k >= 30:
        return "14-35-14"

    elif n < 30 and k < 30 and p >= 30:
        return "17-17-17"

    elif p < 30 and k < 30 and n >= 30:
        return "20-20"

    else:
        return "28-28"


rows = []

for i in range(100000):

    temperature = random.randint(20, 40)
    humidity = random.randint(40, 90)
    moisture = random.randint(20, 80)

    soil = random.choice(soils)
    crop = random.choice(crops)

    nitrogen = random.randint(10, 60)
    potassium = random.randint(10, 60)
    phosphorus = random.randint(10, 60)

    fertilizer = choose_fertilizer(
        nitrogen,
        phosphorus,
        potassium
    )

    rows.append([
        temperature,
        humidity,
        moisture,
        soil,
        crop,
        nitrogen,
        potassium,
        phosphorus,
        fertilizer
    ])


columns = [
    "Temperature",
    "Humidity",
    "Moisture",
    "Soil Type",
    "Crop Type",
    "Nitrogen",
    "Potassium",
    "Phosphorous",
    "Fertilizer Name"
]

df = pd.DataFrame(rows, columns=columns)

df.to_csv(
    Path(__file__).resolve().parent / "fertilizer_ml_dataset.csv",
    index=False
)

print("ML dataset created successfully!")
print("Shape:", df.shape)

print("\nFertilizer distribution:")
print(df["Fertilizer Name"].value_counts())

print("\nSaved as: fertilizer_ml_dataset.csv")
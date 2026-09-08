import csv
import json
import random
import os

SEED = 42
random.seed(SEED)

NAMES = [
    "Ramesh Kumar", "Selvi", "Murugan", "Lakshmi", "Sundar", "Karthikeyan",
    "Prakash", "Uma", "Saravanan", "Geetha", "Anand", "Divya", "Venkatesh",
    "Kavitha", "Senthil", "Meena", "Vijay", "Deepa", "Rajesh", "Priya"
]

LOCATIONS = [
    "Dharapuram, Tamil Nadu", "Karamadai, Tamil Nadu", "Annur, Tamil Nadu",
    "Palladam, Tamil Nadu", "Coimbatore, Tamil Nadu", "Erode, Tamil Nadu",
    "Dindigul, Tamil Nadu", "Tiruppur, Tamil Nadu", "Salem, Tamil Nadu",
    "Karur, Tamil Nadu", "Pollachi, Tamil Nadu", "Udumalaipettai, Tamil Nadu"
]

CROPS = ["Chilli", "Tomato", "Capsicum", "Onion", "Brinjal", "Okra"]
VARIETIES = ["Local", "Hybrid", "CO-1", "NHRDF"]
GROWTH_STAGES = ["Vegetative", "Flowering", "Fruiting", "Bulbing"]
WATER_AVAIL = ["Adequate", "Limited", "Rainfed", "Unavailable"]
WATER_SOURCES = ["Borewell", "Canal", "Well", "Rainfed"]
IRRIGATION = ["Drip Irrigation", "Sprinkler", "Manual", "None"]
EQUIPMENT_OPTIONS = ["Sprayer", "Drip Irrigation", "Pump", "Tractor", "Power Tiller", "Manual Tools"]
INPUT_OPTIONS = [
    ("Neem Oil", "L"), ("Compost", "kg"), ("Fertilizer", "kg"),
    ("Pesticide", "L"), ("Bio-Pesticide", "L"), ("Micronutrients", "kg")
]
SOIL_TYPES = ["Red Loam", "Black Soil", "Clay", "Sandy"]

def generate_scenarios(count=60):
    scenarios = []
    for i in range(1, count + 1):
        f_id = f"F{i:03d}"
        name = random.choice(NAMES) + (f" ({i})" if i > 20 else "")
        phone = f"+91 {random.randint(60000, 99999)} {random.randint(10000, 99999)}"
        location = random.choice(LOCATIONS)
        farm_size = round(random.uniform(0.5, 8.0), 1)
        crop = random.choice(CROPS)
        variety = random.choice(VARIETIES)
        growth_stage = random.choice(GROWTH_STAGES)
        workers = random.randint(1, 6)
        budget = float(random.choice([400, 800, 1200, 2500, 3800, 5000, 8500, 12000]))
        water_avail = random.choice(WATER_AVAIL)
        water_src = random.choice(WATER_SOURCES)
        irr = random.choice(IRRIGATION)
        
        # Pick 1-3 equipment items
        equip = random.sample(EQUIPMENT_OPTIONS, k=random.randint(1, 3))
        
        # Pick 1-3 inputs with random quantities
        inp_items = []
        for inp_name, unit in random.sample(INPUT_OPTIONS, k=random.randint(1, 3)):
            qty = float(random.choice([1, 2, 5, 10, 15, 25, 50]))
            inp_items.append({"input_name": inp_name, "quantity": qty, "unit": unit})

        temp = round(random.uniform(22.0, 38.0), 1)
        rainfall = round(random.uniform(0.0, 60.0), 1)
        humidity = round(random.uniform(40.0, 85.0), 1)
        soil = random.choice(SOIL_TYPES)

        scenarios.append({
            "id": f_id,
            "name": name,
            "phone": phone,
            "location": location,
            "farm_size": farm_size,
            "crop": crop,
            "variety": variety,
            "growth_stage": growth_stage,
            "workers": workers,
            "budget": budget,
            "water_availability": water_avail,
            "water_source": water_src,
            "irrigation_available": irr,
            "equipment": json.dumps(equip),
            "inputs": json.dumps(inp_items),
            "temperature": temp,
            "rainfall": rainfall,
            "humidity": humidity,
            "soil_type": soil,
            "is_synthetic": True
        })
    return scenarios

def save_scenarios_csv(scenarios, filepath):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    fieldnames = list(scenarios[0].keys())
    with open(filepath, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(scenarios)

if __name__ == "__main__":
    data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
    csv_file = os.path.join(data_dir, "farm_scenarios.csv")
    scenarios = generate_scenarios(60)
    save_scenarios_csv(scenarios, csv_file)
    print(f"Successfully generated {len(scenarios)} synthetic farm scenarios in '{csv_file}'.")

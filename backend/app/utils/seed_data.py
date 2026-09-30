import json
import os
import csv
import re
from pathlib import Path
from sqlalchemy.orm import Session
from app.models.models import Farmer, FarmerEquipment, FarmerInput, AgronomyRule, User, Buyer, BuyerRequirement, HarvestProduce
from app.utils.security import hash_password

SEED_RULES = [
    {
        "rule_id": "AGR-001",
        "crop": "Chilli",
        "variety": "All",
        "growth_stage": "Fruiting",
        "condition": "Moisture stress / Pest risk during fruit development",
        "recommendation": "Apply Neem Oil emulsion spray (15ml/L) and light drip fertigation to prevent fruit rot and thrips infestation without soil waterlogging.",
        "required_inputs": json.dumps([
            {"input_name": "Neem Oil", "quantity": 1.5, "unit": "L"},
            {"input_name": "Compost", "quantity": 10.0, "unit": "kg"}
        ]),
        "required_equipment": json.dumps(["Sprayer"]),
        "min_workers": 2,
        "max_farm_size": 10.0,
        "min_water": "Limited",
        "estimated_cost": 1200.0,
        "risk_level": "Low",
        "evidence_source": "TNAU Agronomy Guide for Horticultural Crops (2023)",
        "evidence_reference": "TNAU-HORT-CHILLI-SEC4.2",
        "version": "1.0",
        "status": "APPROVED",
        "is_high_impact": False
    },
    {
        "rule_id": "AGR-002",
        "crop": "Chilli",
        "variety": "All",
        "growth_stage": "Fruiting",
        "condition": "Severe thrips attack / High infestation",
        "recommendation": "Foliar application of Imidacloprid (0.5ml/L) using knapsack sprayer under calm weather conditions.",
        "required_inputs": json.dumps([
            {"input_name": "Pesticide", "quantity": 0.5, "unit": "L"}
        ]),
        "required_equipment": json.dumps(["Sprayer"]),
        "min_workers": 2,
        "max_farm_size": 10.0,
        "min_water": "Limited",
        "estimated_cost": 2800.0,
        "risk_level": "High",
        "evidence_source": "ICAR Insect Pest Management Guidelines for Solanaceous Crops",
        "evidence_reference": "ICAR-IPM-CHILLI-08",
        "version": "1.0",
        "status": "APPROVED",
        "is_high_impact": True
    },
    {
        "rule_id": "AGR-003",
        "crop": "Chilli",
        "variety": "All",
        "growth_stage": "Fruiting",
        "condition": "Low budget alternative / organic maintenance",
        "recommendation": "Apply bio-pesticide Panchagavya spray (3% concentration) using basic sprayer tools.",
        "required_inputs": json.dumps([
            {"input_name": "Bio-Pesticide", "quantity": 1.0, "unit": "L"}
        ]),
        "required_equipment": json.dumps(["Sprayer"]),
        "min_workers": 1,
        "max_farm_size": 5.0,
        "min_water": "Limited",
        "estimated_cost": 450.0,
        "risk_level": "Low",
        "evidence_source": "Organic Horticulture Extension Manual",
        "evidence_reference": "OHEM-CHILLI-ALT-02",
        "version": "1.0",
        "status": "APPROVED",
        "is_high_impact": False
    },
    {
        "rule_id": "AGR-004",
        "crop": "Tomato",
        "variety": "All",
        "growth_stage": "Flowering",
        "condition": "Calcium deficiency / Blossom end rot prevention",
        "recommendation": "Soil application of Gypsum (50kg/acre) and micronutrient foliar spray (2g/L).",
        "required_inputs": json.dumps([
            {"input_name": "Fertilizer", "quantity": 25.0, "unit": "kg"},
            {"input_name": "Compost", "quantity": 20.0, "unit": "kg"}
        ]),
        "required_equipment": json.dumps(["Sprayer", "Drip Irrigation"]),
        "min_workers": 3,
        "max_farm_size": 15.0,
        "min_water": "Adequate",
        "estimated_cost": 3200.0,
        "risk_level": "Medium",
        "evidence_source": "IIHR Tomato Production Bulletin",
        "evidence_reference": "IIHR-TOMATO-NUT-12",
        "version": "1.0",
        "status": "APPROVED",
        "is_high_impact": False
    },
    {
        "rule_id": "AGR-005",
        "crop": "Tomato",
        "variety": "All",
        "growth_stage": "Flowering",
        "condition": "Budget-constrained flower retention spray",
        "recommendation": "Foliar spray of Boron (1g/L) during early morning hours.",
        "required_inputs": json.dumps([
            {"input_name": "Micronutrients", "quantity": 0.5, "unit": "kg"}
        ]),
        "required_equipment": json.dumps(["Sprayer"]),
        "min_workers": 1,
        "max_farm_size": 10.0,
        "min_water": "Limited",
        "estimated_cost": 650.0,
        "risk_level": "Low",
        "evidence_source": "TNAU Agronomy Advisory (Tomato)",
        "evidence_reference": "TNAU-TOMATO-FLOW-04",
        "version": "1.0",
        "status": "APPROVED",
        "is_high_impact": False
    },
    {
        "rule_id": "AGR-006",
        "crop": "Capsicum",
        "variety": "All",
        "growth_stage": "Fruiting",
        "condition": "Drip fertigation & fruit enlargement",
        "recommendation": "Fertigate NPK 13-0-45 (4kg/acre) through drip system every 4 days with mulching inspection.",
        "required_inputs": json.dumps([
            {"input_name": "Fertilizer", "quantity": 10.0, "unit": "kg"}
        ]),
        "required_equipment": json.dumps(["Drip Irrigation", "Pump"]),
        "min_workers": 2,
        "max_farm_size": 20.0,
        "min_water": "Adequate",
        "estimated_cost": 4100.0,
        "risk_level": "Low",
        "evidence_source": "National Horticulture Board Polyhouse Advisory",
        "evidence_reference": "NHB-CAPSICUM-FERT-09",
        "version": "1.0",
        "status": "APPROVED",
        "is_high_impact": False
    },
    {
        "rule_id": "AGR-007",
        "crop": "Capsicum",
        "variety": "All",
        "growth_stage": "Flowering",
        "condition": "Manual weed control & hill topping",
        "recommendation": "Perform manual weeding between rows and apply organic compost around root zones.",
        "required_inputs": json.dumps([
            {"input_name": "Compost", "quantity": 30.0, "unit": "kg"}
        ]),
        "required_equipment": json.dumps(["Manual Tools"]),
        "min_workers": 3,
        "max_farm_size": 5.0,
        "min_water": "Limited",
        "estimated_cost": 1500.0,
        "risk_level": "Low",
        "evidence_source": "Organic Vegetable Farming Handbook",
        "evidence_reference": "OVFH-CAP-WEED-01",
        "version": "1.0",
        "status": "APPROVED",
        "is_high_impact": False
    },
    {
        "rule_id": "AGR-008",
        "crop": "Onion",
        "variety": "All",
        "growth_stage": "Bulbing",
        "condition": "Bulb development & purple blotch prevention",
        "recommendation": "Apply Potassium Sulphate (SOP) fertigation (5kg/acre) and Mancozeb spray if humidity > 75%.",
        "required_inputs": json.dumps([
            {"input_name": "Fertilizer", "quantity": 15.0, "unit": "kg"},
            {"input_name": "Pesticide", "quantity": 1.0, "unit": "kg"}
        ]),
        "required_equipment": json.dumps(["Sprayer", "Drip Irrigation"]),
        "min_workers": 3,
        "max_farm_size": 15.0,
        "min_water": "Adequate",
        "estimated_cost": 3800.0,
        "risk_level": "Medium",
        "evidence_source": "DOGR Onion Crop Health Guide",
        "evidence_reference": "DOGR-ONION-BULB-03",
        "version": "1.0",
        "status": "APPROVED",
        "is_high_impact": False
    },
    {
        "rule_id": "AGR-009",
        "crop": "Chilli",
        "variety": "All",
        "growth_stage": "Vegetative",
        "condition": "Early vegetative vigor & sucking pest prevention",
        "recommendation": "Apply bio-stimulant foliar spray (2ml/L) and light drenching with Panchagavya (3%) to enhance shoot density and prevent early aphids.",
        "required_inputs": json.dumps([
            {"input_name": "Fertilizer", "quantity": 5.0, "unit": "kg"},
            {"input_name": "Pesticide", "quantity": 0.5, "unit": "L"}
        ]),
        "required_equipment": json.dumps(["Sprayer"]),
        "min_workers": 1,
        "max_farm_size": 10.0,
        "min_water": "Limited",
        "estimated_cost": 1100.0,
        "risk_level": "Low",
        "evidence_source": "TNAU Agronomy Guide for Horticultural Crops (2023)",
        "evidence_reference": "TNAU-HORT-CHILLI-VEG-01",
        "version": "1.0",
        "status": "APPROVED",
        "is_high_impact": False
    },
    {
        "rule_id": "AGR-010",
        "crop": "Chilli",
        "variety": "All",
        "growth_stage": "Vegetative",
        "condition": "Low budget early vegetative protection",
        "recommendation": "Foliar spray of Neem seed kernel extract (NSKE 5%) using knapsack sprayer for early thrips deterrence.",
        "required_inputs": json.dumps([
            {"input_name": "Neem Oil", "quantity": 1.0, "unit": "L"}
        ]),
        "required_equipment": json.dumps(["Sprayer"]),
        "min_workers": 1,
        "max_farm_size": 5.0,
        "min_water": "Limited",
        "estimated_cost": 350.0,
        "risk_level": "Low",
        "evidence_source": "ICAR Organic Pest Management Guidelines",
        "evidence_reference": "ICAR-OPM-CHILLI-02",
        "version": "1.0",
        "status": "APPROVED",
        "is_high_impact": False
    },
    {
        "rule_id": "AGR-011",
        "crop": "Tomato",
        "variety": "All",
        "growth_stage": "Vegetative",
        "condition": "Canopy establishment & damping off protection",
        "recommendation": "Apply Trichoderma viride bio-fungicide drenching (10g/L) and organic compost incorporated around root beds.",
        "required_inputs": json.dumps([
            {"input_name": "Compost", "quantity": 20.0, "unit": "kg"}
        ]),
        "required_equipment": json.dumps(["Manual Tools"]),
        "min_workers": 2,
        "max_farm_size": 10.0,
        "min_water": "Limited",
        "estimated_cost": 1250.0,
        "risk_level": "Low",
        "evidence_source": "IIHR Tomato Cultural Practices Manual",
        "evidence_reference": "IIHR-TOMATO-VEG-05",
        "version": "1.0",
        "status": "APPROVED",
        "is_high_impact": False
    },
    {
        "rule_id": "AGR-012",
        "crop": "Capsicum",
        "variety": "All",
        "growth_stage": "Vegetative",
        "condition": "Vegetative branching & drip fertigation initialization",
        "recommendation": "Fertigate NPK 19-19-19 (3kg/acre) through drip system every 3 days.",
        "required_inputs": json.dumps([
            {"input_name": "Fertilizer", "quantity": 15.0, "unit": "kg"}
        ]),
        "required_equipment": json.dumps(["Drip Irrigation", "Pump"]),
        "min_workers": 2,
        "max_farm_size": 15.0,
        "min_water": "Adequate",
        "estimated_cost": 2200.0,
        "risk_level": "Low",
        "evidence_source": "NHB Polyhouse Capsicum Guidelines",
        "evidence_reference": "NHB-CAPSICUM-VEG-02",
        "version": "1.0",
        "status": "APPROVED",
        "is_high_impact": False
    },
    {
        "rule_id": "AGR-DEMO-001",
        "crop": "Chilli",
        "variety": "All",
        "growth_stage": "Fruiting",
        "condition": "Experimental nano-fertilizer trial",
        "recommendation": "Apply Nano-N spray (4ml/L) during late evening hours.",
        "required_inputs": json.dumps([
            {"input_name": "Nano-Fertilizer", "quantity": 0.5, "unit": "L"}
        ]),
        "required_equipment": json.dumps(["Sprayer"]),
        "min_workers": 1,
        "max_farm_size": 5.0,
        "min_water": "Limited",
        "estimated_cost": 800.0,
        "risk_level": "Medium",
        "evidence_source": "Demo Agronomy Research Draft",
        "evidence_reference": "DEMO-NANO-CHILLI-01",
        "version": "1.0-demo",
        "status": "DEMO",
        "is_high_impact": False
    },
    {
        "rule_id": "AGR-DEMO-002",
        "crop": "Tomato",
        "variety": "All",
        "growth_stage": "Vegetative",
        "condition": "Soil specific trial requiring black soil",
        "recommendation": "Incorporate Trichoderma viride bio-fungicide in black soil root beds.",
        "required_inputs": json.dumps([
            {"input_name": "Bio-Fungicide", "quantity": 2.0, "unit": "kg"}
        ]),
        "required_equipment": json.dumps(["Manual Tools"]),
        "min_workers": 2,
        "max_farm_size": 10.0,
        "min_water": "Limited",
        "estimated_cost": 950.0,
        "risk_level": "Low",
        "evidence_source": "Soil Health Demonstration Project",
        "evidence_reference": "DEMO-SOIL-TOMATO-02",
        "version": "1.0-demo",
        "status": "DEMO",
        "is_high_impact": False
    }
]

SEED_FARMERS = [
    {
        "id": "F024",
        "name": "Uma",
        "phone": "+91 98765 43210",
        "location": "Dharapuram, Tamil Nadu",
        "farm_size": 2.0,
        "crop": "Chilli",
        "variety": "Local",
        "growth_stage": "Fruiting",
        "workers": 2,
        "budget": 3800.0,
        "water_availability": "Limited",
        "water_source": "Borewell",
        "irrigation_available": "Drip Irrigation",
        "temperature": 31.5,
        "rainfall": 12.0,
        "humidity": 65.0,
        "soil_type": "Red Loam",
        "is_synthetic": True,
        "equipment": ["Sprayer", "Drip Irrigation"],
        "inputs": [
            {"input_name": "Neem Oil", "quantity": 2.0, "unit": "L"},
            {"input_name": "Compost", "quantity": 15.0, "unit": "kg"},
            {"input_name": "Fertilizer", "quantity": 10.0, "unit": "kg"}
        ]
    },
    {
        "id": "F027",
        "name": "Saravanan",
        "phone": "+91 87654 32109",
        "location": "Karamadai, Tamil Nadu",
        "farm_size": 3.6,
        "crop": "Capsicum",
        "variety": "Hybrid",
        "growth_stage": "Fruiting",
        "workers": 4,
        "budget": 9500.0,
        "water_availability": "Adequate",
        "water_source": "Canal",
        "irrigation_available": "Drip Irrigation",
        "temperature": 28.0,
        "rainfall": 45.0,
        "humidity": 70.0,
        "soil_type": "Black Soil",
        "is_synthetic": True,
        "equipment": ["Drip Irrigation", "Sprayer", "Pump"],
        "inputs": [
            {"input_name": "Fertilizer", "quantity": 50.0, "unit": "kg"},
            {"input_name": "Compost", "quantity": 40.0, "unit": "kg"}
        ]
    },
    {
        "id": "F021",
        "name": "Prakash",
        "phone": "+91 97654 32108",
        "location": "Annur, Tamil Nadu",
        "farm_size": 3.2,
        "crop": "Capsicum",
        "variety": "Hybrid",
        "growth_stage": "Flowering",
        "workers": 4,
        "budget": 8500.0,
        "water_availability": "Adequate",
        "water_source": "Borewell",
        "irrigation_available": "Drip Irrigation",
        "temperature": 29.5,
        "rainfall": 20.0,
        "humidity": 68.0,
        "soil_type": "Red Loam",
        "is_synthetic": True,
        "equipment": ["Drip Irrigation", "Pump", "Sprayer"],
        "inputs": [
            {"input_name": "Compost", "quantity": 35.0, "unit": "kg"},
            {"input_name": "Fertilizer", "quantity": 25.0, "unit": "kg"}
        ]
    },
    {
        "id": "F028",
        "name": "Geetha",
        "phone": "+91 96543 21097",
        "location": "Palladam, Tamil Nadu",
        "farm_size": 2.4,
        "crop": "Tomato",
        "variety": "Hybrid",
        "growth_stage": "Flowering",
        "workers": 2,
        "budget": 5500.0,
        "water_availability": "Limited",
        "water_source": "Well",
        "irrigation_available": "Drip Irrigation",
        "temperature": 32.0,
        "rainfall": 5.0,
        "humidity": 55.0,
        "soil_type": "Red Loam",
        "is_synthetic": True,
        "equipment": ["Drip Irrigation", "Sprayer"],
        "inputs": [
            {"input_name": "Fertilizer", "quantity": 30.0, "unit": "kg"},
            {"input_name": "Compost", "quantity": 25.0, "unit": "kg"}
        ]
    },
    {
        "id": "F001",
        "name": "Ramesh Kumar",
        "phone": "+91 98765 43210",
        "location": "Coimbatore, Tamil Nadu",
        "farm_size": 2.5,
        "crop": "Tomato",
        "variety": "Hybrid",
        "growth_stage": "Flowering",
        "workers": 3,
        "budget": 5000.0,
        "water_availability": "Adequate",
        "water_source": "Borewell",
        "irrigation_available": "Drip Irrigation",
        "temperature": 30.0,
        "rainfall": 15.0,
        "humidity": 60.0,
        "soil_type": "Red Loam",
        "is_synthetic": True,
        "equipment": ["Sprayer", "Drip Irrigation"],
        "inputs": [
            {"input_name": "Fertilizer", "quantity": 30.0, "unit": "kg"},
            {"input_name": "Compost", "quantity": 25.0, "unit": "kg"}
        ]
    },
    {
        "id": "F002",
        "name": "Selvi",
        "phone": "+91 87654 32109",
        "location": "Erode, Tamil Nadu",
        "farm_size": 1.8,
        "crop": "Chilli",
        "variety": "Local",
        "growth_stage": "Vegetative",
        "workers": 2,
        "budget": 3000.0,
        "water_availability": "Limited",
        "water_source": "Borewell",
        "irrigation_available": "Sprayer",
        "temperature": 33.0,
        "rainfall": 0.0,
        "humidity": 50.0,
        "soil_type": "Clay",
        "is_synthetic": True,
        "equipment": ["Sprayer"],
        "inputs": [
            {"input_name": "Fertilizer", "quantity": 10.0, "unit": "kg"},
            {"input_name": "Pesticide", "quantity": 1.0, "unit": "L"}
        ]
    }
]

def load_rules_from_csv(csv_path: str) -> list:
    """Parses agronomy rules from CSV dataset."""
    if not os.path.exists(csv_path):
        return []

    rules = []
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rule_id = row.get("rule_id", "").strip()
            if not rule_id:
                continue

            crop = row.get("crop", "Chilli").strip()
            variety = row.get("variety", "Any").strip()
            growth_stage = row.get("growth_stage", "Any").strip()
            trigger_condition = row.get("trigger_condition", "").strip()
            action = row.get("action", "").strip()
            condition = trigger_condition if trigger_condition else (action if action else "General agronomy guidance")
            recommendation = action if action else condition

            # Inputs parsing
            req_input = row.get("required_input", "").strip()
            inputs_list = []
            if req_input and req_input.lower() not in ("none", "n/a", ""):
                qty_val = 1.0
                qty_raw = row.get("quantity", "").strip()
                try:
                    qty_val = float(qty_raw)
                except ValueError:
                    match = re.search(r"(\d+(\.\d+)?)", qty_raw)
                    if match:
                        qty_val = float(match.group(1))
                inputs_list.append({
                    "input_name": req_input,
                    "quantity": qty_val,
                    "unit": row.get("unit", "kg").strip() or "kg"
                })

            # Equipment parsing
            req_equip = row.get("required_equipment", "").strip()
            equip_list = []
            if req_equip and req_equip.lower() not in ("none", "n/a", ""):
                equip_list = [e.strip() for e in req_equip.split(",") if e.strip() and e.strip().lower() not in ("none", "n/a")]

            # Min workers & max farm size
            min_workers = 1
            if row.get("min_workers") and row["min_workers"].strip().isdigit():
                min_workers = int(row["min_workers"].strip())

            max_farm_size = None
            if row.get("max_farm_size_acres"):
                try:
                    max_farm_size = float(row["max_farm_size_acres"].strip())
                except ValueError:
                    max_farm_size = None

            min_water = row.get("water_condition", "Limited").strip()
            if not min_water or min_water.lower() in ("none", "n/a"):
                min_water = "Limited"

            risk = row.get("risk_level", "LOW").strip().upper()
            risk_level = "High" if risk == "HIGH" else ("Medium" if risk == "MEDIUM" else "Low")

            high_impact_str = str(row.get("high_impact", "")).strip().lower()
            is_high_impact = high_impact_str in ("yes", "true", "1")

            status_raw = row.get("status", "APPROVED_SOURCE").strip().upper()
            if status_raw in ("APPROVED_SOURCE", "APPROVED"):
                status = "APPROVED"
            elif status_raw == "DEMO":
                status = "DEMO"
            elif status_raw == "INACTIVE":
                status = "INACTIVE"
            else:
                status = "NEEDS_APPROVAL"

            # Cost estimation
            rule_type = row.get("rule_type", "").strip().lower()
            if "chemical" in rule_type or "pesticide" in rule_type:
                cost = 2500.0
            elif "fertilizer" in rule_type or "nutrient" in rule_type:
                cost = 1800.0
            elif "bio" in rule_type or "organic" in rule_type:
                cost = 600.0
            elif "water" in rule_type or "irrigation" in rule_type:
                cost = 500.0
            else:
                cost = 800.0

            evidence_org = row.get("evidence_organization", "TNAU/ICAR").strip()
            evidence_title = row.get("evidence_title", "Agronomy Guide").strip()
            evidence_source = f"{evidence_org} - {evidence_title}"

            page_sec = row.get("evidence_page_or_section", "").strip()
            url = row.get("evidence_url", "").strip()
            if page_sec and url:
                evidence_ref = f"{page_sec} ({url})"
            elif url:
                evidence_ref = url
            elif page_sec:
                evidence_ref = page_sec
            else:
                evidence_ref = f"Ref: {rule_id}"

            rules.append({
                "rule_id": rule_id,
                "crop": crop,
                "variety": variety,
                "growth_stage": growth_stage,
                "condition": condition,
                "recommendation": recommendation,
                "required_inputs": json.dumps(inputs_list),
                "required_equipment": json.dumps(equip_list),
                "min_workers": min_workers,
                "max_farm_size": max_farm_size,
                "min_water": min_water,
                "estimated_cost": cost,
                "risk_level": risk_level,
                "evidence_source": evidence_source,
                "evidence_reference": evidence_ref,
                "version": row.get("rule_version", "1.0").strip() or "1.0",
                "status": status,
                "is_high_impact": is_high_impact
            })
    return rules

def load_farmers_from_csv(csv_path: str) -> list:
    """Parses farmer scenarios from CSV dataset."""
    if not os.path.exists(csv_path):
        return []

    farmers = []
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            f_id = row.get("id", "").strip()
            if not f_id:
                continue

            equip_str = row.get("equipment", "[]")
            inputs_str = row.get("inputs", "[]")

            try:
                equip_list = json.loads(equip_str)
            except Exception:
                equip_list = []

            try:
                inputs_list = json.loads(inputs_str)
            except Exception:
                inputs_list = []

            farmers.append({
                "id": f_id,
                "name": row.get("name", f"Farmer {f_id}"),
                "phone": row.get("phone", "+91 98765 43210"),
                "location": row.get("location", "Coimbatore, Tamil Nadu"),
                "farm_size": float(row.get("farm_size", 2.0)),
                "crop": row.get("crop", "Chilli"),
                "variety": row.get("variety", "Local"),
                "growth_stage": row.get("growth_stage", "Vegetative"),
                "workers": int(row.get("workers", 2)),
                "budget": float(row.get("budget", 5000.0)),
                "water_availability": row.get("water_availability", "Limited"),
                "water_source": row.get("water_source", "Borewell"),
                "irrigation_available": row.get("irrigation_available", "Drip Irrigation"),
                "temperature": float(row["temperature"]) if row.get("temperature") and row["temperature"].strip() else 30.0,
                "rainfall": float(row["rainfall"]) if row.get("rainfall") and row["rainfall"].strip() else 10.0,
                "humidity": float(row["humidity"]) if row.get("humidity") and row["humidity"].strip() else 60.0,
                "soil_type": row.get("soil_type", "Red Loam"),
                "is_synthetic": True,
                "equipment": equip_list,
                "inputs": inputs_list
            })
    return farmers

def seed_database(db: Session):
    """Populates database with initial agronomy rules (from CSV and SEED_RULES) and farmer profiles."""
    all_rules_data = []

    # 1. Try to load rules from CSV first
    base_dir = Path(__file__).resolve().parents[3]
    csv_path = base_dir / "data" / "agronomy_rules.csv"
    if csv_path.exists():
        csv_rules = load_rules_from_csv(str(csv_path))
        all_rules_data.extend(csv_rules)

    # 2. Add fallback/hardcoded seed rules if not already present
    existing_rule_ids = {r["rule_id"] for r in all_rules_data}
    for r in SEED_RULES:
        if r["rule_id"] not in existing_rule_ids:
            all_rules_data.append(r)

    # 3. Seed or update Agronomy Rules individually
    for r_data in all_rules_data:
        existing = db.query(AgronomyRule).filter(AgronomyRule.rule_id == r_data["rule_id"]).first()
        if not existing:
            rule = AgronomyRule(**r_data)
            db.add(rule)
        else:
            for k, v in r_data.items():
                setattr(existing, k, v)
    db.commit()

    # 4. Seed Farmers individually (CSV + hardcoded SEED_FARMERS)
    all_farmers_data = []
    farmer_csv_path = base_dir / "data" / "farm_scenarios.csv"
    if farmer_csv_path.exists():
        all_farmers_data.extend(load_farmers_from_csv(str(farmer_csv_path)))

    existing_farmer_ids = {f["id"] for f in all_farmers_data}
    for f in SEED_FARMERS:
        if f["id"] not in existing_farmer_ids:
            all_farmers_data.append(f)

    for f_data in all_farmers_data:
        existing = db.query(Farmer).filter(Farmer.id == f_data["id"]).first()
        f_copy = dict(f_data)
        equip_list = f_copy.pop("equipment", [])
        inputs_list = f_copy.pop("inputs", [])

        if not existing:
            farmer = Farmer(**f_copy)
            db.add(farmer)
            db.commit()
            db.refresh(farmer)
            target_id = farmer.id
        else:
            for k, v in f_copy.items():
                setattr(existing, k, v)
            db.commit()
            db.refresh(existing)
            target_id = existing.id
            db.query(FarmerEquipment).filter(FarmerEquipment.farmer_id == target_id).delete()
            db.query(FarmerInput).filter(FarmerInput.farmer_id == target_id).delete()
            db.commit()

        for eq_name in equip_list:
            eq = FarmerEquipment(farmer_id=target_id, equipment_name=eq_name)
            db.add(eq)

        for inp_item in inputs_list:
            inp = FarmerInput(
                farmer_id=target_id,
                input_name=inp_item["input_name"],
                quantity=inp_item["quantity"],
                unit=inp_item["unit"]
            )
            db.add(inp)

        db.commit()

    # 5. Seed Users for Auth
    SEED_USERS = [
        {
            "id": "USR-001",
            "name": "Uma (Farmer)",
            "email": "farmer1@example.com",
            "phone": "9876543210",
            "password_hash": hash_password("FarmerPassword123!"),
            "account_type": "FARMER",
            "farmer_id": "F024",
            "buyer_id": None,
            "status": "ACTIVE"
        },
        {
            "id": "USR-002",
            "name": "Selvi (Farmer)",
            "email": "selvi@example.com",
            "phone": "8765432109",
            "password_hash": hash_password("FarmerPassword123!"),
            "account_type": "FARMER",
            "farmer_id": "F002",
            "buyer_id": None,
            "status": "ACTIVE"
        },
        {
            "id": "USR-003",
            "name": "Chennai Export Hub",
            "email": "buyer1@example.com",
            "phone": "9876500001",
            "password_hash": hash_password("BuyerPassword123!"),
            "account_type": "BUYER",
            "farmer_id": None,
            "buyer_id": "B001",
            "status": "ACTIVE"
        },
        {
            "id": "USR-004",
            "name": "Coimbatore Wholesale Market",
            "email": "buyer2@example.com",
            "phone": "9876500002",
            "password_hash": hash_password("BuyerPassword123!"),
            "account_type": "BUYER",
            "farmer_id": None,
            "buyer_id": "B002",
            "status": "ACTIVE"
        },
        {
            "id": "USR-005",
            "name": "Agronomy Specialist",
            "email": "staff@cropcompaz.local",
            "phone": "9876500099",
            "password_hash": hash_password("StaffPassword123!"),
            "account_type": "COOPERATIVE_STAFF",
            "farmer_id": None,
            "buyer_id": None,
            "status": "ACTIVE"
        },
        {
            "id": "USR-006",
            "name": "Kesav (Farmer)",
            "email": "kesav@cropcompaz.local",
            "phone": "6379802406",
            "password_hash": hash_password("FarmerPassword123!"),
            "account_type": "FARMER",
            "farmer_id": "F024",
            "buyer_id": None,
            "status": "ACTIVE"
        }
    ]

    for u_data in SEED_USERS:
        existing = db.query(User).filter(User.id == u_data["id"]).first()
        if not existing:
            user = User(**u_data)
            db.add(user)
        else:
            for k, v in u_data.items():
                setattr(existing, k, v)
    db.commit()

    # 6. Seed Buyers
    SEED_BUYERS = [
        {
            "id": "B001",
            "name": "Chennai Export Hub",
            "buyer_type": "Export",
            "market": "Chennai APMC",
            "location": "Chennai, Tamil Nadu",
            "contact": "+91 98765 00001",
            "required_crops": json.dumps(["Tomato", "Chilli", "Capsicum"]),
            "status": "ACTIVE"
        },
        {
            "id": "B002",
            "name": "Coimbatore Wholesale Market",
            "buyer_type": "Wholesale",
            "market": "Coimbatore APMC",
            "location": "Coimbatore, Tamil Nadu",
            "contact": "+91 98765 00002",
            "required_crops": json.dumps(["Onion", "Tomato", "Brinjal"]),
            "status": "ACTIVE"
        }
    ]

    for b_data in SEED_BUYERS:
        existing = db.query(Buyer).filter(Buyer.id == b_data["id"]).first()
        if not existing:
            b_obj = Buyer(**b_data)
            db.add(b_obj)
    db.commit()

    # 7. Seed Buyer Requirements
    if db.query(BuyerRequirement).count() == 0:
        req1 = BuyerRequirement(
            buyer_id="B001",
            crop="Chilli",
            variety="Any",
            required_grade="Grade A",
            min_size_mm=70.0,
            max_size_mm=100.0,
            max_damage_pct=1.5,
            max_disease_pct=0.5,
            pest_tolerance="Zero Tolerance",
            quantity_required_kg=1000.0,
            packaging_requirement="Corrugated boxes 5kg",
            status="ACTIVE"
        )
        req2 = BuyerRequirement(
            buyer_id="B001",
            crop="Tomato",
            variety="Any",
            required_grade="Grade A",
            min_size_mm=60.0,
            max_size_mm=80.0,
            max_damage_pct=2.0,
            max_disease_pct=1.0,
            pest_tolerance="Zero Tolerance",
            quantity_required_kg=2500.0,
            packaging_requirement="Crates 20kg",
            status="ACTIVE"
        )
        db.add_all([req1, req2])
        db.commit()

    # 8. Seed Harvest Produce
    SEED_HARVESTS = [
        {
            "id": "H001",
            "farmer_id": "F024",
            "crop": "Chilli",
            "variety": "Local",
            "harvest_date": "2026-09-25",
            "quantity": 250.0,
            "unit": "kg",
            "grade": "Grade A",
            "damage_pct": 1.2,
            "disease_pct": 0.5,
            "inspection_status": "Inspected",
            "assigned_buyer": "Chennai Export Hub"
        },
        {
            "id": "H002",
            "farmer_id": "F002",
            "crop": "Chilli",
            "variety": "Local",
            "harvest_date": "2026-09-29",
            "quantity": 140.0,
            "unit": "kg",
            "grade": "Grade A",
            "damage_pct": 0.8,
            "disease_pct": 0.3,
            "inspection_status": "Inspected",
            "assigned_buyer": "Chennai Export Hub"
        }
    ]

    for h_data in SEED_HARVESTS:
        existing = db.query(HarvestProduce).filter(HarvestProduce.id == h_data["id"]).first()
        if not existing:
            h_obj = HarvestProduce(**h_data)
            db.add(h_obj)
    db.commit()




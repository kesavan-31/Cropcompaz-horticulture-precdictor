# CropCompass

> **“Guiding Every Crop Decision with the Resources You Have.”**

Full project title: **CropCompass – A Resource-Aware Horticulture Advisory Assistant**

---

## Overview

CropCompass is a resource-aware horticulture advisory assistant that generates practical, evidence-based recommendations by evaluating a farmer's actual resources and constraints:
- Farmer profile & location
- Farm size (acres)
- Crop, variety, and growth stage
- Available family and hired workers
- Budget (₹)
- Equipment inventory (sprayer, drip irrigation, pump, tractor)
- Available inputs with quantities and units (e.g. Neem Oil 2L, Compost 15kg)
- Water availability, source, and irrigation method
- Local micro-climate (temperature, rainfall, humidity, soil type)

Visual styling strictly matches the **AgriVista & AgriWise** reference dashboards with CropCompass branding:
- Deep dark green sidebar (`#163B2F` / `#1B4D3E`)
- Bright lime green active navigation item (`#B4F042`)
- Warm cream background (`#FAF8F5`)
- White rounded cards (`border-radius: 1rem`) with subtle borders and soft shadows
- 3-column AgriWise Farmer card grid with circular pastel icons and bottom resource bar

---

## Key Features (Phase 1 Working Prototype)

1. **Farmer Management**: Full CRUD operations for farmer profiles with form validations (phone, farm size, budget, climate ranges) and modal delete confirmation.
2. **Resource & Input Quantity Checking**: Evaluates available equipment and input quantities against rule requirements.
3. **Agronomy Knowledge Base & Rule Versioning**: Structured rules with versioning (`v1.0`), status (`APPROVED` vs `DEMO`), and evidence citations.
4. **Feasibility Scoring Engine**: Computes transparent decision-support feasibility scores (0–100) and status badges (`HIGHLY FEASIBLE`, `PARTIALLY FEASIBLE`, `NOT FEASIBLE`).
5. **Decision Explainability**: "Why this recommendation?" detail modal displaying matched conditions, resource constraint pass/fail list, and evidence citations.
6. **Alternative Recommendations**: Automatically evaluates and presents eligible alternative rules when primary actions fail constraints.
7. **5 Explicit Failure Cases**: Handled and verified via Pytest suite (Low budget, Missing equipment, Missing required data, Invalid climate data, High-impact chemical review).
8. **Dynamic Dashboard**: Powered by live SQLite database queries.
9. **Baseline Experiment & Synthetic Data**: Scenario generator (`scripts/generate_farm_scenarios.py`) and empirical comparison runner (`scripts/run_experiment.py`).

---

## Repository Structure

```text
CropCompass/
├── frontend/             # React + TypeScript + Vite + Tailwind CSS
├── backend/              # FastAPI + SQLAlchemy + SQLite + Pytest
├── data/                 # Farm scenarios & agronomy rule datasets
├── scripts/              # Scenario generator & experiment runner
├── notebooks/            # Jupyter notebook experiment presentation
└── docs/                 # System documentation suite (11 markdown docs)
```

---

## How to Run the Application

### 1. Run the Backend API (FastAPI)

```bash
# Navigate to project root
cd CropCompass

# Set PYTHONPATH and start Uvicorn server using Python 3.11
$env:PYTHONPATH="backend"
py -3.11 -m uvicorn app.main:app --reload --port 8000
```

Backend REST API will be live at `http://127.0.0.1:8000/api/health` and Swagger UI at `http://127.0.0.1:8000/docs`.

### 2. Run the Frontend UI (Vite + React)

```bash
# Navigate to frontend directory
cd CropCompass/frontend

# Start Vite development server
& "C:\Program Files\nodejs\npm.cmd" run dev
```

Frontend application will be live at `http://localhost:5173`.

---

## How to Run Backend Unit Tests

```bash
# Set PYTHONPATH and run Pytest test suite
$env:PYTHONPATH="backend"
py -3.11 -m pytest backend/tests
```

All 14 unit tests (validations, constraint engine, feasibility scorer, 5 failure cases, REST APIs) will execute and pass.

---

## How to Run the Baseline Experiment

```bash
py -3.11 scripts/run_experiment.py
```

---

## License

MIT License

## cd C:\Users\Kesav\Downloads\CropCompass\frontend
npm.cmd run dev 
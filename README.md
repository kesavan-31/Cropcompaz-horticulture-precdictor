# CropCompaz

> **“Guiding Every Crop Decision with the Resources You Have.”**

Full project title: **CropCompaz – A Resource-Aware Horticulture Advisory Assistant**

---

## Overview

CropCompaz is an integrated resource-aware horticulture decision-support platform connecting farmers, farm resource inventories, verified agronomy knowledge, resource constraint checking, recommendation engines, buyer quality requirements, advisor review, and quality grading analytics.

### Key Capabilities:
- Farmer profile & location management
- Farm size (acres), soil profile, & local micro-climate tracking
- Crop, variety, and growth stage matching
- Available family/hired labor validation
- Budget (₹) & input inventory verification
- Equipment inventory (Sprayer, Drip Irrigation, Pump, Tractor, Power Tiller)
- Water availability, source, and irrigation method checks
- Deterministic resource constraint checker & feasibility scoring
- Buyer quality requirements & grade compatibility (Grade A, B, C, Rejected)
- Advisor review, approve/modify/reject workflows, and audit logging
- Market & Crop Intelligence analytics dashboard

Visual styling strictly matches the **AgriWise / AgriVista** reference dashboards with CropCompaz branding:
- Deep dark green sidebar (`#163B2F` / `#1B4D3E`)
- Bright lime green active navigation item (`#B4F042`)
- Warm cream background (`#FAF8F5`)
- White rounded cards (`border-radius: 1rem`) with soft borders and clean typography

---

## System Architecture

```
FARMER & FARM RESOURCES
       ↓
AGRONOMY KNOWLEDGE BASE (TNAU / ICAR)
       ↓
RESOURCE CONSTRAINT CHECKING (Budget, Labor, Equipment, Water, Climate, Soil)
       ↓
FEASIBILITY & RECOMMENDATION ENGINE
       ↓
BUYER REQUIREMENTS & TRADE-OFF ANALYSIS
       ↓
ADVISOR REVIEW & AUDIT TRAIL
       ↓
PRODUCE GRADING & BUYER MATCHING
```

---

## Running the Application

### 1. Backend API (FastAPI + SQLite)
```cmd
cd backend
set PYTHONPATH=.
py -3.11 -m uvicorn app.main:app --reload --port 8000
```
- API Docs: `http://127.0.0.1:8000/docs`
- Health Check: `http://127.0.0.1:8000/api/health`

### 2. Frontend Application (React 18 + TypeScript + Vite)
```cmd
cd frontend
npm run dev
```
- Application UI: `http://localhost:5173`

### 3. Run Automated Tests
```cmd
cd backend
set PYTHONPATH=.
py -3.11 -m pytest tests
```

---

## License

MIT License. See LICENSE file for details.
# CropCompaz

> **“Guiding Every Crop Decision with the Resources You Have.”**

Full project title: **CropCompaz – A Resource-Aware Horticulture Advisory Assistant**

---

## Overview

CropCompaz is an integrated resource-aware horticulture decision-support platform connecting farmers, farm resource inventories, verified agronomy knowledge, resource constraint checking, recommendation engines, buyer quality requirements, advisor review, and quality grading analytics.

### Key Capabilities:
- **Dedicated Portals**: Separate Farmer and Buyer login workflows (`/farmer/login` and `/buyer/login`) with strict data isolation.
- **Farmer Profile & Resource Inventory**: Farm size (acres), soil profile, micro-climate, equipment, and input stock tracking.
- **Agronomy Knowledge Base**: 50 official, source-backed rules from **TNAU**, **ICAR**, and **NCONF**.
- **Resource Constraint Checker**: Deterministic 6-tier checking (budget, labor, equipment, inputs, water, climate).
- **Buyer Quality Standards**: Grade specifications (Grade A, B, C, Rejected) and procurement lot matching.
- **Bilingual Interface**: Support for English and தமிழ் across all portals.

---

## Portals & Test Seed Accounts

| Portal | URL | Demo Identifier | Password | Access & Features |
| :--- | :--- | :--- | :--- | :--- |
| **Farmer Portal** | `http://localhost:5173/farmer/login` | `farmer1@example.com` *(or `9876543210`)* | `FarmerPassword123!` | Farm resources, crop advisory, recommendation history, harvest records, feedback |
| **Buyer Portal** | `http://localhost:5173/buyer/login` | `buyer1@example.com` *(or `9876500001`)* | `BuyerPassword123!` | Quality requirements, available produce batches, traceability, procurement reviews |
| **Cooperative Operations** | `http://localhost:5173/cooperative/dashboard` | *Direct Access* | — | Cooperative dashboard, all farmer records, quality intelligence, audit log |

---

## How to Run in VS Code

### Method 1: Using VS Code Integrated Terminals (Recommended)

1. Open VS Code in `C:\Users\Kesav\Downloads\CropCompass`.
2. Open Terminal 1 for the **Backend API**:
   ```powershell
   cmd /c "set PYTHONPATH=backend && py -3.11 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
   ```
   *Note: Using `--host 127.0.0.1` prevents Windows socket permission error `[WinError 10013]`.*

3. Open Terminal 2 (Click `+` in Terminal panel) for the **Frontend Web App**:
   ```powershell
   cd frontend
   npm run dev
   ```

4. Open your browser and navigate to:
   - **Landing Page**: `http://localhost:5173/`
   - **Farmer Sign In**: `http://localhost:5173/farmer/login`
   - **Buyer Sign In**: `http://localhost:5173/buyer/login`

---

## Running Automated Tests

Run all 24 Pytest unit & authentication isolation tests:
```powershell
cmd /c "set PYTHONPATH=backend && py -3.11 -m pytest backend/tests"
```

---

## License

MIT License. See LICENSE file for details.
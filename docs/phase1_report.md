# CropCompass Phase 1 Prototype Report

## Executive Summary

**CropCompass** is a resource-aware horticulture advisory assistant designed to generate practical, evidence-based recommendations tailored to a farmer's actual constraints (budget, equipment inventory, input quantities, labor availability, water sources, and micro-climate conditions).

Visual UI styling strictly follows the provided AgriVista & AgriWise reference dashboards:
- Deep dark green sidebar (`#163B2F` / `#1B4D3E`)
- Bright lime green active navigation pill (`#B4F042`)
- Warm cream background (`#FAF8F5`)
- Rounded white cards (`border-radius: 1rem`) with subtle borders and soft shadows
- 3-column AgriWise Farmer card grid layout with pastel circular icons and bottom resource bar

---

## Phase 1 Feature Status Matrix

| Feature Module | Phase 1 Status | Details / Implementation |
| :--- | :--- | :--- |
| **Farmer Management & Profiles** | `COMPLETED` | Full CRUD, 3-column card grid, SYNTHETIC badges, modal delete confirmation |
| **Form Validation** | `COMPLETED` | Phone (+91), farm size (>0), budget/workers (>=0), climate ranges |
| **Resource Inventory & Water** | `COMPLETED` | Equipment list, input quantities & units, water source & availability |
| **Agronomy Knowledge Base** | `COMPLETED` | Versioned rules (`v1.0`), status (`APPROVED` vs `DEMO`), evidence citations |
| **Recommendation Engine** | `COMPLETED` | Deterministic resource matching, constraint checker |
| **Feasibility Scoring** | `COMPLETED` | Weighted formula (0–100), explicit decision-support disclaimer |
| **Decision Explainability** | `COMPLETED` | "Why this recommendation?" detail modal with constraint pass/fail list |
| **Alternative Recommendation** | `COMPLETED` | Automatic search for lower-cost eligible alternative when primary fails |
| **Baseline & Experiment** | `COMPLETED` | Baseline engine, synthetic scenario generator (60 scenarios), CLI runner |
| **5 Failure Cases** | `COMPLETED` | Unit tests & runtime execution for all 5 failure scenarios |
| **Recommendation History** | `COMPLETED` | Persistent audit table in SQLite with rule status, cost, score |
| **Dynamic Dashboard** | `COMPLETED` | KPI cards computed dynamically from SQLite queries |
| **Pytest Unit Suite** | `COMPLETED` | 14/14 tests passing cleanly |
| **Multilingual UI Foundation** | `PARTIALLY COMPLETED` | English UI with Tamil language selector foundation in header |
| **User Validation** | `PARTIALLY COMPLETED` | Validation plan prepared (`docs/user_validation.md`) for Phase 2 testing |
| **Human Approval Workflow** | `PLANNED FOR PHASE 2` | `requires_human_confirmation` flag active; full workflow in Phase 2 |
| **Authentication & RBAC** | `PLANNED FOR PHASE 3` | Security basics implemented; full auth in Phase 3 |

---

## End-to-End Verification (Uma Scenario F024)

1. **Farmer Creation / View**: Uma (F024), Dharapuram, 2 acres Chilli, Fruiting, 2 workers, Budget ₹3,800, Sprayer, Drip Irrigation, Neem Oil (2L), Fertilizer (10kg).
2. **Advisory Execution**: Primary rule `AGR-001 v1.0` (Status: `APPROVED`) matched with Feasibility Score 92.0 (`HIGHLY FEASIBLE`), Estimated Cost ₹1,200.
3. **Explainability Check**: Opened "Why this recommendation?" modal $\rightarrow$ verified Budget PASS (Req ₹1,200, Avail ₹3,800), Equipment PASS (Sprayer), Inputs PASS (Neem Oil 1.5L needed vs 2L avail).
4. **Low Budget Failure Case**: Changed budget to ₹100 $\rightarrow$ re-ran advisory $\rightarrow$ primary rule became `NOT FEASIBLE`, Budget constraint FAIL, eligible alternative rule `AGR-003 v1.0` (Panchagavya spray, ₹450) automatically recommended.

---

## Technical Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, React Router 6.
- **Backend**: Python 3.11, FastAPI, SQLAlchemy 2.0, Pydantic v2, Pytest, Uvicorn.
- **Database**: SQLite (`cropcompass.db`).

# CropCompass Phase 1 Objectives

The Phase 1 objective of CropCompass is to build a fully working end-to-end software prototype.

## Core Objectives

1. **Farmer & Resource Capture**: Capture farmer identity, contact details, farm size, crop, variety, growth stage, workers, budget, water sources, equipment, and input quantities.
2. **Form Input Validation**: Implement real-time validation for phone numbers, positive farm sizes, non-negative budget/workers, and valid local climate ranges.
3. **Agronomy Knowledge Base**: Store versioned agronomy rules with explicit status flags (`APPROVED` vs `DEMO` vs `NEEDS_APPROVAL`).
4. **Constraint Checking Engine**: Execute independent checks for budget, equipment, input quantities, labor, water, and local conditions.
5. **Feasibility Scoring**: Compute transparent decision-support feasibility scores (0–100) and badges (`HIGHLY FEASIBLE`, `PARTIALLY FEASIBLE`, `NOT FEASIBLE`).
6. **Decision Explainability**: Provide a "Why this recommendation?" detail modal displaying matched conditions, resource pass/fail lists, and evidence citations.
7. **Alternative Recommendations**: Automatically evaluate and present eligible alternative rules when primary recommendations fail constraints.
8. **Baseline Comparison**: Compare resource-aware recommendations against a generic baseline model.
9. **Failure Cases**: Test 5 explicit failure scenarios (Low budget, Missing equipment, Missing required data, Out-of-range climate data, High-impact chemical review).
10. **Dynamic Dashboard & Audit Trail**: Power UI KPI cards and recommendation history dynamically from SQLite database queries.

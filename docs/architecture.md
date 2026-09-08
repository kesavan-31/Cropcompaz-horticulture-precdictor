# CropCompass Architecture Specification

## Component Architecture

```mermaid
graph TD
    UI["React + TypeScript Frontend (AgriVista / AgriWise Theme)"] --> API["FastAPI REST API"]
    API --> FS["Farmer Service & Input Validation"]
    API --> RS["Recommendation Service"]
    API --> BS["Baseline Service"]
    RS --> CC["Constraint Checker (Budget, Equipment, Inputs, Labor, Water)"]
    RS --> FSCORE["Feasibility Scorer (Weighted Decision Support)"]
    RS --> KB["Agronomy Rule Base (Versioned)"]
    API --> DB[(SQLite Database / SQLAlchemy ORM)]
```

## Data Flow Diagram

```text
Farmer Profile & Resources
       ↓
Input Validation & Error Reporting
       ↓
Approved/Eligible Rule Filtering (Status: APPROVED, or DEMO if Demo Mode ON)
       ↓
Agronomic Rule Matching (Crop, Variety, Growth Stage)
       ↓
Resource Constraint Checking (Budget, Equipment, Input Quantities, Workers, Water, Local Compatibility)
       ↓
Feasibility Scoring (0–100 Weighted Score)
       ↓
Primary Recommendation (Checks for High-Impact / Human Review)
       ↓
Alternative Search if Primary is Not Feasible (Queries remaining eligible rules)
       ↓
Evidence / "Why this recommendation?" Detailed Breakdown
       ↓
Recommendation History Persistence
```

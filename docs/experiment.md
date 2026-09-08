# CropCompass Phase 1 Experiment Methodology

## Experiment Design

A head-to-head empirical comparison was conducted evaluating:
- **Baseline Engine**: Matches agronomy rules solely by Crop + Growth Stage, ignoring budget, equipment, inputs, labor, and water constraints.
- **CropCompass Engine**: Executes deterministic resource constraint checking and transparent feasibility scoring.

## Dataset
- 60 synthetic farm scenarios generated via `scripts/generate_farm_scenarios.py` with randomized resource constraints.

## Metrics
- **Feasibility Rate**: Percentage of generated recommendations that pass resource constraints.
- **Constraint Violation Count**: Total number of unfeasible recommendations produced.
- **Agronomic Relevance Score**: Percentage of recommendations matching crop micro-climate requirements.

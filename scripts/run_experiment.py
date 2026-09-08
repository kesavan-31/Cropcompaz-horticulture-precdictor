import os
import sys

# Add backend directory to sys.path
backend_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend")
sys.path.insert(0, backend_path)

from app.database import SessionLocal, engine, Base
from app.routes.experiments import run_experiment
from app.utils.seed_data import seed_database

def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
        res = run_experiment(db)
        print("\n========================================================")
        print("CROPCOMPASS PHASE 1 EXPERIMENTAL COMPARISON RESULTS")
        print("========================================================")
        print(f"Total Synthetic Farm Scenarios: {res.total_scenarios}")
        print(f"Baseline Feasibility Rate:      {res.baseline_feasibility_rate}%")
        print(f"Baseline Constraint Violations: {res.baseline_constraint_violations}")
        print(f"CropCompass Feasibility Rate:   {res.cropcompass_feasibility_rate}%")
        print(f"CropCompass Violations:         {res.cropcompass_constraint_violations}")
        print(f"Resource-Aware Improvement:    +{res.improvement_percentage}%")
        print(f"Agronomic Relevance Score:      {res.relevance_rate}%")
        print("========================================================\n")
    finally:
        db.close()

if __name__ == "__main__":
    main()

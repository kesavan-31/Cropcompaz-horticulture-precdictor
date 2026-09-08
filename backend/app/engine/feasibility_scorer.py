from typing import List
from app.engine.constraint_checker import ConstraintResult

FEASIBILITY_DISCLAIMER = "These weights are project-defined decision-support weights and are not claimed to be scientifically validated."

def compute_feasibility_score(constraints: List[ConstraintResult]) -> tuple[float, str]:
    """
    Computes transparent decision-support feasibility score (0-100) and status badge.
    Formula weights:
    - Agronomic Match: 30%
    - Budget: 20%
    - Equipment: 15%
    - Inputs & Quantities: 15%
    - Labor: 10%
    - Water & Local Conditions: 10%
    If any critical constraint (Budget, Equipment, Inputs) fails completely, status is NOT_FEASIBLE.
    """
    c_map = {c.constraint_name: c.status for c in constraints}

    def status_score(status: str) -> float:
        if status == "PASS":
            return 100.0
        elif status == "PARTIAL":
            return 50.0
        return 0.0

    agronomic_score = 100.0
    budget_score = status_score(c_map.get("Budget", "PASS"))
    equipment_score = status_score(c_map.get("Equipment", "PASS"))
    inputs_score = status_score(c_map.get("Inputs & Quantities", "PASS"))
    labor_score = status_score(c_map.get("Labor", "PASS"))
    local_score = status_score(c_map.get("Local Conditions & Water Compatibility", "PASS"))

    score = (
        0.30 * agronomic_score +
        0.20 * budget_score +
        0.15 * equipment_score +
        0.15 * inputs_score +
        0.10 * labor_score +
        0.10 * local_score
    )

    score = round(score, 1)

    # Critical failure override
    has_critical_failure = (
        c_map.get("Budget") == "FAIL" or
        c_map.get("Equipment") == "FAIL" or
        c_map.get("Inputs & Quantities") == "FAIL"
    )

    if has_critical_failure:
        status = "NOT_FEASIBLE"
    elif score >= 80.0:
        status = "HIGHLY_FEASIBLE"
    elif score >= 50.0:
        status = "PARTIALLY_FEASIBLE"
    else:
        status = "NOT_FEASIBLE"

    return score, status

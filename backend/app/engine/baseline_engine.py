from sqlalchemy.orm import Session
from app.models.models import Farmer, AgronomyRule
from typing import Dict, Any

def generate_baseline_recommendation(farmer: Farmer, db: Session) -> Dict[str, Any]:
    """
    Generic baseline service:
    Matches rules ONLY based on Crop + Growth Stage.
    Ignores budget, equipment, inputs, labor, water, and local micro-climate.
    """
    rule = db.query(AgronomyRule).filter(
        AgronomyRule.crop.ilike(farmer.crop),
        AgronomyRule.growth_stage.ilike(farmer.growth_stage)
    ).first()

    if not rule:
        return {
            "is_matched": False,
            "rule_id": "NONE",
            "recommendation_text": "Standard general crop care advice.",
            "estimated_cost": 0.0,
            "ignores_constraints": True
        }

    return {
        "is_matched": True,
        "rule_id": rule.rule_id,
        "recommendation_text": rule.recommendation,
        "estimated_cost": rule.estimated_cost,
        "ignores_constraints": True
    }

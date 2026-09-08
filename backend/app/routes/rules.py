from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.models import AgronomyRule
from app.schemas.schemas import AgronomyRuleOut, RequiredInputSchema
import json

router = APIRouter(prefix="/api/agronomy-rules", tags=["Agronomy Rules"])

@router.get("", response_model=List[AgronomyRuleOut])
def get_agronomy_rules(
    crop: Optional[str] = None,
    growth_stage: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(AgronomyRule)
    if crop:
        query = query.filter(AgronomyRule.crop.ilike(crop))
    if growth_stage:
        query = query.filter(AgronomyRule.growth_stage.ilike(growth_stage))
    if status:
        query = query.filter(AgronomyRule.status == status)

    rules = query.order_by(AgronomyRule.rule_id.asc()).all()

    out = []
    for r in rules:
        try:
            req_inp = json.loads(r.required_inputs)
        except Exception:
            req_inp = []

        try:
            req_eq = json.loads(r.required_equipment)
        except Exception:
            req_eq = []

        rule_dict = {
            "rule_id": r.rule_id,
            "crop": r.crop,
            "variety": r.variety,
            "growth_stage": r.growth_stage,
            "condition": r.condition,
            "recommendation": r.recommendation,
            "required_inputs": req_inp,
            "required_equipment": req_eq,
            "min_workers": r.min_workers,
            "max_farm_size": r.max_farm_size,
            "min_water": r.min_water,
            "estimated_cost": r.estimated_cost,
            "risk_level": r.risk_level,
            "evidence_source": r.evidence_source,
            "evidence_reference": r.evidence_reference,
            "version": r.version,
            "status": r.status,
            "is_high_impact": r.is_high_impact,
            "created_at": r.created_at,
            "updated_at": r.updated_at
        }
        out.append(AgronomyRuleOut(**rule_dict))

    return out

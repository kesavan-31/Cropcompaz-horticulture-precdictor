from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.models import Farmer, Recommendation, AgronomyRule, ConstraintCheck
from app.schemas.schemas import RecommendationOut, RecommendationCreateRequest
from app.engine.recommendation_engine import generate_recommendation_for_farmer

router = APIRouter(prefix="/api/recommendations", tags=["Recommendations"])

@router.post("")
def create_recommendation(payload: RecommendationCreateRequest, db: Session = Depends(get_db)):
    farmer = db.query(Farmer).filter(Farmer.id == payload.farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail=f"Farmer '{payload.farmer_id}' not found.")

    res = generate_recommendation_for_farmer(farmer, db, demo_mode=payload.demo_mode)
    if "error" in res:
        if res["error"] == "VALIDATION_ERROR":
            raise HTTPException(status_code=400, detail={"error": res["error"], "message": res["message"]})
        elif res["error"] == "NO_MATCHING_RULE":
            raise HTTPException(status_code=404, detail={"error": res["error"], "message": res["message"]})

    return res


@router.get("", response_model=List[RecommendationOut])
def get_recommendations(
    farmer_id: Optional[str] = None,
    limit: int = Query(default=50, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Recommendation)
    if farmer_id:
        query = query.filter(Recommendation.farmer_id == farmer_id)

    recs = query.order_by(Recommendation.created_at.desc()).limit(limit).all()

    # Attach evidence source and reference from rule table
    result = []
    for r in recs:
        rule = db.query(AgronomyRule).filter(AgronomyRule.rule_id == r.rule_id).first()
        r_dict = RecommendationOut.model_validate(r)
        if rule:
            r_dict.evidence_source = rule.evidence_source
            r_dict.evidence_reference = rule.evidence_reference
        result.append(r_dict)

    return result


@router.get("/{rec_id}", response_model=RecommendationOut)
def get_recommendation_by_id(rec_id: int, db: Session = Depends(get_db)):
    rec = db.query(Recommendation).filter(Recommendation.id == rec_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation record not found.")

    rule = db.query(AgronomyRule).filter(AgronomyRule.rule_id == rec.rule_id).first()
    r_dict = RecommendationOut.model_validate(rec)
    if rule:
        r_dict.evidence_source = rule.evidence_source
        r_dict.evidence_reference = rule.evidence_reference
    return r_dict

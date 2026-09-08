from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.models import Farmer, Recommendation, AgronomyRule
from app.schemas.schemas import DashboardMetrics

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("/metrics", response_model=DashboardMetrics)
def get_dashboard_metrics(db: Session = Depends(get_db)):
    active_farmers = db.query(Farmer).count()
    active_farms = active_farmers

    distinct_crops = db.query(func.count(func.distinct(Farmer.crop))).scalar() or 0

    pending_approvals = db.query(Recommendation).filter(
        Recommendation.human_confirmation_status == "PENDING"
    ).count()

    total_recs = db.query(Recommendation).count()

    if total_recs == 0:
        feasibility_rate_str = "No data yet"
        evidence_cov_str = "No data yet"
    else:
        feasible_count = db.query(Recommendation).filter(
            Recommendation.feasibility_status.in_(["HIGHLY_FEASIBLE", "PARTIALLY_FEASIBLE"])
        ).count()
        f_rate = (feasible_count / total_recs) * 100.0
        feasibility_rate_str = f"{f_rate:.1f}%"

        evidence_count = db.query(Recommendation).join(
            AgronomyRule, Recommendation.rule_id == AgronomyRule.rule_id
        ).filter(AgronomyRule.evidence_source != "").count()

        e_rate = (evidence_count / total_recs) * 100.0
        evidence_cov_str = f"{e_rate:.1f}%"

    return DashboardMetrics(
        active_farmers=active_farmers,
        active_farms=active_farms,
        current_crops=distinct_crops,
        pending_approvals=pending_approvals,
        feasibility_rate=feasibility_rate_str,
        total_recommendations=total_recs,
        evidence_coverage=evidence_cov_str,
        system_alerts=0
    )

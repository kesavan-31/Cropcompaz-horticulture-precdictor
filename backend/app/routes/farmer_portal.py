from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, Farmer, Recommendation, HarvestProduce, FeedbackRecord
from app.schemas.schemas import FarmerOut, RecommendationOut, HarvestProduceOut, FeedbackCreateRequest, FeedbackOut
from app.utils.auth import get_current_farmer
from app.engine.recommendation_engine import generate_recommendation_for_farmer
from typing import List

router = APIRouter(prefix="/api/farmer-portal", tags=["Farmer Portal"])

@router.get("/profile", response_model=FarmerOut)
def get_my_farm(current_user: User = Depends(get_current_farmer), db: Session = Depends(get_db)):
    """Retrieve isolated profile for authenticated farmer."""
    if not current_user.farmer_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No farm profile linked to this user account."
        )
    
    farmer = db.query(Farmer).filter(Farmer.id == current_user.farmer_id).first()
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Farm record not found."
        )
    return farmer


@router.get("/recommendations", response_model=List[RecommendationOut])
def get_my_recommendations(current_user: User = Depends(get_current_farmer), db: Session = Depends(get_db)):
    """Retrieve only recommendations belonging to the authenticated farmer."""
    if not current_user.farmer_id:
        return []
    
    recs = db.query(Recommendation).filter(
        Recommendation.farmer_id == current_user.farmer_id
    ).order_by(Recommendation.created_at.desc()).all()
    return recs


@router.post("/recommendations/generate")
def generate_my_advisory(demo_mode: bool = False, current_user: User = Depends(get_current_farmer), db: Session = Depends(get_db)):
    """Generate resource-aware advisory for the authenticated farmer."""
    if not current_user.farmer_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No farm profile associated with this account."
        )
    
    farmer = db.query(Farmer).filter(Farmer.id == current_user.farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farm profile not found.")
    
    result = generate_recommendation_for_farmer(farmer, db, demo_mode=demo_mode)
    if "error" in result:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=result)
    return result


@router.get("/harvests", response_model=List[HarvestProduceOut])
def get_my_harvests(current_user: User = Depends(get_current_farmer), db: Session = Depends(get_db)):
    """Retrieve harvest records for authenticated farmer."""
    if not current_user.farmer_id:
        return []
    
    harvests = db.query(HarvestProduce).filter(
        HarvestProduce.farmer_id == current_user.farmer_id
    ).all()
    return harvests


@router.post("/feedback", response_model=FeedbackOut)
def submit_farmer_feedback(payload: FeedbackCreateRequest, current_user: User = Depends(get_current_farmer), db: Session = Depends(get_db)):
    """Submit farmer feedback on advisory recommendations."""
    feedback = FeedbackRecord(
        user_id=current_user.id,
        farmer_id=current_user.farmer_id,
        rating=payload.rating,
        category=payload.category,
        comment=payload.comment
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback

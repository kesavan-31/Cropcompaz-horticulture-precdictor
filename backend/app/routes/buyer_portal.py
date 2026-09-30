from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, Buyer, BuyerRequirement, HarvestProduce, FeedbackRecord
from app.schemas.schemas import BuyerOut, BuyerRequirementOut, HarvestProduceOut, FeedbackCreateRequest, FeedbackOut
from app.utils.auth import get_current_buyer
from typing import List

router = APIRouter(prefix="/api/buyer-portal", tags=["Buyer Portal"])

@router.get("/profile", response_model=BuyerOut)
def get_buyer_profile(current_user: User = Depends(get_current_buyer), db: Session = Depends(get_db)):
    """Retrieve isolated profile for authenticated buyer."""
    if not current_user.buyer_id:
        # Fallback or default buyer profile
        buyer = db.query(Buyer).first()
        if not buyer:
            raise HTTPException(status_code=404, detail="Buyer profile not found.")
        return buyer
    
    buyer = db.query(Buyer).filter(Buyer.id == current_user.buyer_id).first()
    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer profile not found.")
    return buyer


@router.get("/requirements", response_model=List[BuyerRequirementOut])
def get_my_requirements(current_user: User = Depends(get_current_buyer), db: Session = Depends(get_db)):
    """Retrieve requirements defined by authenticated buyer."""
    b_id = current_user.buyer_id or "B001"
    reqs = db.query(BuyerRequirement).filter(BuyerRequirement.buyer_id == b_id).all()
    return reqs


@router.get("/available-produce", response_model=List[HarvestProduceOut])
def get_available_produce(current_user: User = Depends(get_current_buyer), db: Session = Depends(get_db)):
    """Retrieve verified produce batches matching buyer quality standards."""
    produce = db.query(HarvestProduce).filter(
        HarvestProduce.inspection_status == "Inspected"
    ).all()
    return produce


@router.post("/feedback", response_model=FeedbackOut)
def submit_buyer_feedback(payload: FeedbackCreateRequest, current_user: User = Depends(get_current_buyer), db: Session = Depends(get_db)):
    """Submit quality/traceability feedback from buyer."""
    feedback = FeedbackRecord(
        user_id=current_user.id,
        farmer_id=payload.farmer_id,
        rating=payload.rating,
        category="Buyer Quality Assessment",
        comment=payload.comment
    )
    db.add(feedback)
    db.commit()
    db.refresh(feedback)
    return feedback

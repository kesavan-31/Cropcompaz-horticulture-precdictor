from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models.models import User, UserSession, Farmer, Buyer
from app.schemas.schemas import LoginRequest, FarmerRegisterRequest, BuyerRegisterRequest, UserSessionOut, UserProfileOut
from app.utils.security import verify_password, hash_password, generate_session_token
from app.utils.auth import get_current_user
from datetime import datetime, timedelta
import json
import uuid

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/farmer/register", response_model=UserSessionOut)
def farmer_register(payload: FarmerRegisterRequest, db: Session = Depends(get_db)):
    """Register a new farmer, create their farm profile, and issue a session token."""
    phone = payload.phone.strip()
    email = payload.email.strip().lower() if payload.email else None

    # Check if phone already registered
    existing_user = db.query(User).filter(User.phone == phone).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this phone number already exists."
        )

    # Generate unique Farmer ID
    f_count = db.query(Farmer).count() + 1
    farmer_id = f"F{f_count:03d}"
    while db.query(Farmer).filter(Farmer.id == farmer_id).first():
        f_count += 1
        farmer_id = f"F{f_count:03d}"

    # Create Farmer profile
    farmer = Farmer(
        id=farmer_id,
        name=payload.name.strip(),
        phone=phone,
        location=payload.location.strip(),
        farm_size=payload.farm_size,
        crop=payload.crop.strip(),
        variety=payload.variety.strip(),
        growth_stage=payload.growth_stage.strip(),
        workers=payload.workers,
        budget=payload.budget,
        water_availability=payload.water_availability.strip(),
        water_source="Borewell",
        irrigation_available="Drip Irrigation",
        is_synthetic=False
    )
    db.add(farmer)
    db.commit()

    # Create User account
    user_id = f"USR-{uuid.uuid4().hex[:8].upper()}"
    user = User(
        id=user_id,
        name=payload.name.strip(),
        phone=phone,
        email=email,
        password_hash=hash_password(payload.password),
        account_type="FARMER",
        farmer_id=farmer.id,
        status="ACTIVE"
    )
    db.add(user)
    db.commit()

    # Issue Session Token
    token = generate_session_token()
    session = UserSession(
        token=token,
        user_id=user.id,
        expires_at=datetime.utcnow() + timedelta(days=7)
    )
    db.add(session)
    db.commit()

    return UserSessionOut(
        id=user.id,
        name=user.name,
        email=user.email,
        phone=user.phone,
        farmer_id=user.farmer_id,
        buyer_id=user.buyer_id,
        token=token
    )


@router.post("/buyer/register", response_model=UserSessionOut)
def buyer_register(payload: BuyerRegisterRequest, db: Session = Depends(get_db)):
    """Register a new buyer profile, and issue a session token."""
    phone = payload.phone.strip()
    email = payload.email.strip().lower() if payload.email else None

    existing_user = db.query(User).filter(User.phone == phone).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this phone number already exists."
        )

    # Generate unique Buyer ID
    b_count = db.query(Buyer).count() + 1
    buyer_id = f"B{b_count:03d}"
    while db.query(Buyer).filter(Buyer.id == buyer_id).first():
        b_count += 1
        buyer_id = f"B{b_count:03d}"

    # Create Buyer profile
    buyer = Buyer(
        id=buyer_id,
        name=payload.name.strip(),
        buyer_type=payload.buyer_type,
        market=payload.market.strip(),
        location=payload.location.strip(),
        contact=phone,
        required_crops=json.dumps(payload.required_crops),
        status="ACTIVE"
    )
    db.add(buyer)
    db.commit()

    # Create User account
    user_id = f"USR-{uuid.uuid4().hex[:8].upper()}"
    user = User(
        id=user_id,
        name=payload.name.strip(),
        phone=phone,
        email=email,
        password_hash=hash_password(payload.password),
        account_type="BUYER",
        buyer_id=buyer.id,
        status="ACTIVE"
    )
    db.add(user)
    db.commit()

    token = generate_session_token()
    session = UserSession(
        token=token,
        user_id=user.id,
        expires_at=datetime.utcnow() + timedelta(days=7)
    )
    db.add(session)
    db.commit()

    return UserSessionOut(
        id=user.id,
        name=user.name,
        email=user.email,
        phone=user.phone,
        farmer_id=user.farmer_id,
        buyer_id=user.buyer_id,
        token=token
    )


@router.post("/farmer/login", response_model=UserSessionOut)
def farmer_login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate a farmer account and issue a secure session token."""
    identifier = payload.identifier.strip()
    user = db.query(User).filter(
        or_(User.email.ilike(identifier), User.phone == identifier)
    ).first()

    # Generic rejection if user not found, invalid password, or not a farmer
    if not user or not verify_password(payload.password, user.password_hash) or user.account_type != "FARMER" or user.status != "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unable to sign in with these credentials."
        )

    token = generate_session_token()
    session = UserSession(
        token=token,
        user_id=user.id,
        expires_at=datetime.utcnow() + timedelta(days=7)
    )
    db.add(session)
    db.commit()

    return UserSessionOut(
        id=user.id,
        name=user.name,
        email=user.email,
        phone=user.phone,
        farmer_id=user.farmer_id,
        buyer_id=user.buyer_id,
        token=token
    )


@router.post("/buyer/login", response_model=UserSessionOut)
def buyer_login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate a buyer account and issue a secure session token."""
    identifier = payload.identifier.strip()
    user = db.query(User).filter(
        or_(User.email.ilike(identifier), User.phone == identifier)
    ).first()

    if not user or not verify_password(payload.password, user.password_hash) or user.account_type != "BUYER" or user.status != "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unable to sign in with these credentials."
        )

    token = generate_session_token()
    session = UserSession(
        token=token,
        user_id=user.id,
        expires_at=datetime.utcnow() + timedelta(days=7)
    )
    db.add(session)
    db.commit()

    return UserSessionOut(
        id=user.id,
        name=user.name,
        email=user.email,
        phone=user.phone,
        farmer_id=user.farmer_id,
        buyer_id=user.buyer_id,
        token=token
    )


@router.post("/staff/login", response_model=UserSessionOut)
def staff_login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate a staff/advisor account and issue a secure session token."""
    identifier = payload.identifier.strip()
    user = db.query(User).filter(
        or_(User.email.ilike(identifier), User.phone == identifier)
    ).first()

    if not user or not verify_password(payload.password, user.password_hash) or user.account_type not in ["COOPERATIVE_STAFF", "ADMIN"] or user.status != "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unable to sign in with these credentials."
        )

    token = generate_session_token()
    session = UserSession(
        token=token,
        user_id=user.id,
        expires_at=datetime.utcnow() + timedelta(days=7)
    )
    db.add(session)
    db.commit()

    return UserSessionOut(
        id=user.id,
        name=user.name,
        email=user.email,
        phone=user.phone,
        farmer_id=user.farmer_id,
        buyer_id=user.buyer_id,
        token=token
    )


@router.get("/me", response_model=UserProfileOut)
def get_me(user: User = Depends(get_current_user)):
    """Retrieve current authenticated profile without exposing internal role codes."""
    return user


@router.post("/logout")
def logout(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Invalidate active sessions for user."""
    db.query(UserSession).filter(UserSession.user_id == user.id).delete()
    db.commit()
    return {"message": "Signed out successfully."}

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models.models import User, UserSession
from app.schemas.schemas import LoginRequest, UserSessionOut, UserProfileOut
from app.utils.security import verify_password, generate_session_token
from app.utils.auth import get_current_user
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

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

    # Create new session
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

    # Generic rejection if user not found, invalid password, or not a buyer
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

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, UserSession
from datetime import datetime

security_scheme = HTTPBearer(auto_error=False)

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Validate bearer session token and return the current user."""
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication credentials were not provided."
        )
    
    token = credentials.credentials
    session = db.query(UserSession).filter(UserSession.token == token).first()
    if not session:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session invalid or expired."
        )
    
    if session.expires_at and session.expires_at < datetime.utcnow():
        db.delete(session)
        db.commit()
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has expired. Please sign in again."
        )
    
    user = db.query(User).filter(User.id == session.user_id).first()
    if not user or user.status != "ACTIVE":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is inactive or not found."
        )
    
    return user


def get_current_farmer(user: User = Depends(get_current_user)) -> User:
    """Enforce Farmer portal access only."""
    if user.account_type != "FARMER":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to authorized farmer accounts."
        )
    return user


def get_current_buyer(user: User = Depends(get_current_user)) -> User:
    """Enforce Buyer portal access only."""
    if user.account_type != "BUYER":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to authorized buyer accounts."
        )
    return user


def get_current_staff(user: User = Depends(get_current_user)) -> User:
    """Enforce Staff/Admin portal access."""
    if user.account_type not in ["COOPERATIVE_STAFF", "ADMIN"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to authorized cooperative personnel."
        )
    return user

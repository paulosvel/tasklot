from fastapi import APIRouter, Depends, HTTPException, status
from app.models.user import User
from app.schemas.user import UserCreate, LoginRequest
from app.database.database import SessionLocal
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.utils import hash_password
from jose import jwt
import datetime

router = APIRouter()
SECRET_KEY = "your_secret_key"  # Replace with your actual secret key
ALGORITHM = "HS256"
@router.post("/auth/register")
def register(user: UserCreate):
    db = SessionLocal()
    hashed_password = hash_password(user.password)  # Hash the password
    db_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password,
        role_id=None,  # Explicitly set to None if not provided
        team_id=None   # Explicitly set to None if not provided
    )
    
    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except IntegrityError:
        db.rollback()  # Rollback the session to avoid issues
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists. Please choose a different username."
        )

@router.post("/auth/login")
def login(login_request: LoginRequest):
    db = SessionLocal()
    db_user = db.query(User).filter(User.username == login_request.username).first()
    
    if not db_user or not hash_password.verify(login_request.password, db_user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    # Create JWT token
    token = jwt.encode({
        "sub": db_user.id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Token expiration
    }, SECRET_KEY, algorithm=ALGORITHM)
    
    return {"access_token": token, "token_type": "bearer"}
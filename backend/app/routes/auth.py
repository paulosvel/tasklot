from fastapi import APIRouter, Depends
from app.models.user import User
from app.schemas.user import UserCreate
from app.database.database import SessionLocal
from fastapi import HTTPException, status
from pydantic import BaseModel
from jose import jwt
import datetime

class LoginRequest(BaseModel):
    username: str
    password: str

router = APIRouter()

@router.post("/auth/register")
def register(user: UserCreate):
    db = SessionLocal()
    db_user = User(username=user.username, email=user.email, password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/auth/login")
def login(login_request: LoginRequest):
    db = SessionLocal()
    db_user = db.query(User).filter(User.username == login_request.username, User.password == login_request.password).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    
    # Create JWT token
    token = jwt.encode({
        "sub": db_user.id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)  # Token expiration
    }, SECRET_KEY, algorithm=ALGORITHM)
    
    return {"access_token": token, "token_type": "bearer"}
from fastapi import APIRouter, Depends
from app.models.user import User
from app.schemas.user import UserCreate
from app.database.database import SessionLocal
from fastapi import HTTPException, status
from pydantic import BaseModel

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
    return {"message": "Login successful", "user": db_user.username}
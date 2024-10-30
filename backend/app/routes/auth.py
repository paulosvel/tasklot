from fastapi import APIRouter, Depends
from app.models.user import User
from app.schemas.user import UserCreate
from app.database.database import SessionLocal

router = APIRouter()

@router.post("/auth/register")
def register(user: UserCreate):
    db = SessionLocal()
    db_user = User(username=user.username, email=user.email, password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
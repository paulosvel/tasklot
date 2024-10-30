from fastapi import APIRouter, Depends
from app.models.user import User
from app.database.database import SessionLocal

router = APIRouter()

@router.get("/users/")
def read_users():
    db = SessionLocal()
    users = db.query(User).all()
    return users
from fastapi import APIRouter, Depends, HTTPException
from app.models.user import User
from app.database.database import SessionLocal
from app.dependencies import get_db, Session
from app.utils import hash_password  # Import the hash_password function
from app.schemas.user import UserCreate, UserInDB
router = APIRouter()

@router.get("/users/")
def read_users():
    db = SessionLocal()
    users = db.query(User).all()
    return users

@router.post("/users/", response_model=UserInDB)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Hash the password before saving
    hashed_password = hash_password(user.password)
    db_user = User(username=user.username, email=user.email, password=hashed_password)
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user
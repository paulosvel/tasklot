# app/crud/users.py

from sqlalchemy.orm import Session
from passlib.context import CryptContext
from .. import models, schemas  # Import schemas module

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, email: str, password: str):
    user = get_user_by_email(db, email)
    if not user or not pwd_context.verify(password, user.hashed_password):
        return None
    return user

def create_team(db: Session, team: schemas.TeamCreate, user_id: int):
    db_team = models.Team(name=team.name, owner_id=user_id)  
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team

def add_team_member(db: Session, team_id: int, user_id: int, role: str):
    db_team_member = models.TeamMember(team_id=team_id, user_id=user_id, role=role)
    db.add(db_team_member)
    db.commit()
    db.refresh(db_team_member)
    return db_team_member

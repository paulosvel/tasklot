from fastapi import Depends
from sqlalchemy.orm import Session
from app.database.database import SessionLocal

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
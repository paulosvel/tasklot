from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.database import SessionLocal

router = APIRouter()

# Dependency to get the database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/test-db/")  # Ensure this matches the URL you are trying to access
def test_db_connection(db: Session = Depends(get_db)):
    try:
        # Attempt to execute a simple query
        result = db.execute("SELECT 1").fetchone()
        return {"status": "success", "result": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}
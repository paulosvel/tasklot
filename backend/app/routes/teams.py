from fastapi import APIRouter, Depends
from app.models.team import Team
from app.schemas.team import TeamCreate
from app.database.database import SessionLocal

router = APIRouter()

@router.post("/teams/")
def create_team(team: TeamCreate):
    db = SessionLocal()
    db_team = Team(name=team.name)
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team

@router.get("/teams/")
def read_teams():
    db = SessionLocal()
    teams = db.query(Team).all()
    return teams
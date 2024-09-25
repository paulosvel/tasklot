from sqlalchemy.orm import Session
from .. import models, schemas
from fastapi import HTTPException

def get_teams(db: Session, user_id: int, skip: int = 0, limit: int = 10):
    return db.query(models.Team).filter(models.Team.owner_id == user_id).offset(skip).limit(limit).all()

def create_team(db: Session, team, user_id: int):
    db_team = models.Team(**team.dict(), owner_id=user_id)
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    return db_team

def add_team_member(db: Session, team_id: int, user_id: int, role: str):
    # Create a new team member entry
    team_member = models.TeamMember(team_id=team_id, user_id=user_id, role=role)
    db.add(team_member)
    db.commit()
    db.refresh(team_member)
    return team_member

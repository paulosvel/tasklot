from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db
from ..routers.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=schemas.Team)
def create_team(team: schemas.TeamCreate, db: Session = Depends(get_db)):
    return crud.teams.create_team(db=db, team=team, user_id=1)  # Example user_id

@router.post("/teams/{team_id}/invite", response_model=schemas.TeamMember)
def invite_to_team(team_id: int, email: str, role: str, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    user = crud.get_user_by_email(db, email=email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.add_team_member(db=db, team_id=team_id, user_id=user.id, role=role)
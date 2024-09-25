from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db
from ..routers.auth import get_current_user  # Keep relative import for JWT methods
from ..crud import teams as crud_teams

router = APIRouter()

@router.get("/", response_model=list[schemas.Team])
def get_teams(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    teams = crud.teams.get_teams(db, skip=skip, limit=limit)
    return teams

@router.post("/", response_model=schemas.Team)
def create_team(team: schemas.TeamCreate, db: Session = Depends(get_db)):
    return crud.teams.create_team(db=db, team=team, user_id=1)  # Example user_id

@router.put("/", response_model=schemas.Team)
def update_team(team: schemas.TeamCreate, db: Session = Depends(get_db)):
    return crud.teams.update_team(db=db, team=team, user_id=1)

@router.post("/{team_id}/invite", response_model=schemas.TeamMember)
def invite_to_team(
    team_id: int,
    invite_data: schemas.InviteMember,  # Use a Pydantic model for the request body
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_user)
):
    user = crud.get_user_by_email(db, email=invite_data.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud_teams.add_team_member(db=db, team_id=team_id, user_id=user.id, role=invite_data.role)


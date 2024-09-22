from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import get_db

router = APIRouter()

@router.get("/", response_model=list[schemas.Task])
def read_tasks(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    tasks = crud.tasks.get_tasks(db, skip=skip, limit=limit)
    return tasks

@router.post("/", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    return crud.tasks.create_task(db=db, task=task, user_id=1)  # Example user_id

@router.put("/", response_model=schemas.Task)
def update_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    return crud.tasks.update_task(db=db, task=task, user_id=1)  # Example user_id


from fastapi import APIRouter, Depends
from app.models.task import Task
from app.schemas.task import TaskCreate
from app.database.database import SessionLocal

router = APIRouter()

@router.post("/tasks/")
def create_task(task: TaskCreate):
    db = SessionLocal()
    db_task = Task(title=task.title, description=task.description, due_date=task.due_date, status="To-Do")
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

@router.get("/tasks/")
def read_tasks():
    db = SessionLocal()
    tasks = db.query(Task).all()
    return tasks
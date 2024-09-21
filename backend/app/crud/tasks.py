# app/crud/tasks.py

from sqlalchemy.orm import Session

def get_tasks(db: Session, skip: int = 0, limit: int = 10):
    from .. import models  # Import inside the function
    return db.query(models.Task).offset(skip).limit(limit).all()

def create_task(db: Session, task, user_id: int):
    from .. import models, schemas  # Import inside the function
    db_task = models.Task(**task.dict(), owner_id=user_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

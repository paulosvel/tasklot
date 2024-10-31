from fastapi import APIRouter, Depends, HTTPException
from app.models.task import Task
from app.models.comment import Comment
from app.schemas.comment import CommentCreate
from app.dependencies import get_current_user  # Import the get_current_user function
from app.database.dependencies import get_db  # Import the get_db function from the new location
from app.models.user import User
from sqlalchemy.orm import Session

router = APIRouter()

@router.post("/comments/")
def create_comment(comment: CommentCreate, db: Session = Depends(get_db)):
    db_comment = Comment(content=comment.content, task_id=comment.task_id)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.get("/comments/")
def read_comments(db: Session = Depends(get_db)):
    comments = db.query(Comment).all()
    return comments

@router.post("/tasks/{task_id}/comments")
def create_comment(task_id: int, comment: CommentCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_comment = Comment(task_id=task_id, user_id=current_user.id, content=comment.content)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment
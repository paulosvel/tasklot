from fastapi import APIRouter, Depends
from app.models.comment import Comment
from app.schemas.comment import CommentCreate
from app.database.database import SessionLocal

router = APIRouter()

@router.post("/comments/")
def create_comment(comment: CommentCreate):
    db = SessionLocal()
    db_comment = Comment(content=comment.content, task_id=comment.task_id)
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.get("/comments/")
def read_comments():
    db = SessionLocal()
    comments = db.query(Comment).all()
    return comments
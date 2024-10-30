from sqlalchemy import Column, Integer, String, ForeignKey
from app.database.database import Base

class Comment(Base):
    __tablename__ = 'comments'
    
    id = Column(Integer, primary_key=True, index=True)
    content = Column(String)
    task_id = Column(Integer, ForeignKey('tasks.id'))
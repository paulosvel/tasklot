from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base

class Task(Base):
    __tablename__ = 'tasks'
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    due_date = Column(String)  # You can use DateTime for actual date handling
    status = Column(String)  # e.g., To-Do, In Progress, Done
    owner_id = Column(Integer, ForeignKey('users.id'))
    owner = relationship("User", back_populates="tasks")
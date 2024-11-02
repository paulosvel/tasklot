from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base
from app.models.task import Task

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    role_id = Column(Integer, ForeignKey('roles.id'), nullable=True)  # Allow NULL
    team_id = Column(Integer, ForeignKey("teams.id"), nullable=True)  # Allow NULL
    team = relationship("Team", back_populates="members")
    tasks = relationship("Task", back_populates="owner", foreign_keys=[Task.owner_id])
    role = relationship("Role")  # Define relationship if needed
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    tasks = relationship("Task", back_populates="owner")
    name = Column(String, index=True, nullable=True)
    
    # Relationship for team ownership (not team membership)
    owned_teams = relationship("Team", back_populates="owner")  
    
    # Relationship for team membership (via TeamMember)
    teams = relationship("TeamMember", back_populates="user")  

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, index=True)
    completed = Column(Boolean, default=False)
    owner_id = Column(Integer, ForeignKey("users.id"))
    status = Column(String, index=True)
    owner = relationship("User", back_populates="tasks")


class Team(Base):
    __tablename__ = "teams"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    
    # Owner of the team (a single user)
    owner_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="owned_teams")  # Correctly referencing User.owned_teams
    
    # Members of the team (many users via TeamMember)
    members = relationship("TeamMember", back_populates="team")  # Correctly references TeamMember

class TeamMember(Base):
    __tablename__ = "team_members"
    
    team_id = Column(Integer, ForeignKey("teams.id"), primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), primary_key=True)
    role = Column(String)
    
    # Relationship to Team
    team = relationship("Team", back_populates="members")  # Correctly references Team.members
    
    # Relationship to User
    user = relationship("User", back_populates="teams")  # Correctly references User.teams

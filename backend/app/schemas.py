from pydantic import BaseModel
from typing import List, Optional

class TeamBase(BaseModel):
    name: str
class TeamCreate(TeamBase):
    pass

class Team(TeamBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    name: Optional[str] = None
    teams: List[Team] = []  # Reference Team class here

    class Config:
        orm_mode = True

class TeamMemberBase(BaseModel):
    role: str

class TeamMemberCreate(TeamMemberBase):
    pass

class TeamMember(TeamMemberBase):
    team_id: int
    user_id: int

    class Config:
        orm_mode = True

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: Optional[str] = None
    completed: Optional[bool]= None

class InviteMember(BaseModel):
    email: str
    role: str

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    email: str
    password: str
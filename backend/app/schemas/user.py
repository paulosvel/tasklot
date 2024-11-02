from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

class UserInDB(UserCreate):
    id: int
    hashed_password: str  # Assuming you store the hashed password

    class Config:
        orm_mode = True  # This allows Pydantic to work with SQLAlchemy models
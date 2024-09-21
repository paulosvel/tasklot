from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from . import models, schemas, crud
from .database import engine, Base, get_db
from .routers.auth import create_access_token, get_current_user  # Keep relative import for JWT methods
from datetime import timedelta
from fastapi.middleware.cors import CORSMiddleware

# Initialize the database
Base.metadata.create_all(bind=engine)

# Initialize FastAPI
app = FastAPI()

# Allow specific origins (CORS policy)
origins = [
    "http://localhost",  
    "http://localhost:3000",  
    "http://127.0.0.1:3000",
    "http://localhost:8080"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2PasswordBearer is the mechanism to extract the token
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

# Register a new user
@app.post("/auth/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.users.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.users.create_user(db=db, user=user)

# Login user and return a JWT
@app.post("/auth/login", response_model=schemas.Token)
def login(login_request: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = crud.users.authenticate_user(db, email=login_request.email, password=login_request.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    # JWT token expires after 30 minutes
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    
    return {"access_token": access_token, "token_type": "bearer"}

# Get the current user (protected route)
@app.get("/users/me", response_model=schemas.User)
def read_users_me(current_user: schemas.User = Depends(get_current_user)):
    return current_user

# Get tasks (protected route)
@app.get("/tasks/", response_model=list[schemas.Task])
def read_tasks(skip: int = 0, limit: int = 10, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    tasks = crud.tasks.get_tasks(db, skip=skip, limit=limit)
    return tasks

# Create a task (protected route)
@app.post("/tasks/", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db)):
    return crud.tasks.create_task(db=db, task=task, user_id=1)  # Example user_id
from pydantic import BaseModel
from datetime import datetime

class TaskCreate(BaseModel):
    title: str
    description: str
    due_date: datetime  # You can use str if you prefer to handle date as a string
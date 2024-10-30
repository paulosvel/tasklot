from fastapi import FastAPI
from .routes import auth, tasks, users, test  # Ensure the test router is included

app = FastAPI()

app.include_router(auth.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(test.router)  # This line is crucial
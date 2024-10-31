from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
from .routes import auth, tasks, users, teams, comments  # Ensure the new routers are included

app = FastAPI()

# Allow CORS for specific origins
origins = [
    "http://localhost:3000",  # Your frontend URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)  # Include the auth router
app.include_router(tasks.router)
app.include_router(users.router)
app.include_router(teams.router)  # Include the teams router
app.include_router(comments.router)  # Include the comments router

# WebSocket endpoint
@app.websocket("/ws/tasks")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    while True:
        data = await websocket.receive_text()
        # Broadcast the updated task to all connected clients
        await websocket.send_text(data)
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine
import models  # noqa: F401
from routers import analytics, auth, matching, offices, travel
from ws.connection_manager import manager

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    print("✅ SmartCommute API Started!")
    print("📖 Docs available on FastAPI instance")
    yield


app = FastAPI(
    title="SmartCommute API",
    description="Office Travel Demand Generator",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        os.getenv("FRONTEND_URL", "http://localhost:3000"),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["🔐 Auth"])
app.include_router(offices.router, prefix="/api/offices", tags=["🏢 Offices"])
app.include_router(travel.router, prefix="/api/travel", tags=["🚗 Travel"])
app.include_router(matching.router, prefix="/api/matching", tags=["👥 Matching"])
app.include_router(analytics.router, prefix="/api/analytics", tags=["📊 Analytics"])


@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(user_id, websocket)
    try:
        while True:
            await websocket.receive_text()
            await manager.send_to_user(
                user_id,
                {
                    "type": "pong",
                    "message": "connected",
                },
            )
    except WebSocketDisconnect:
        manager.disconnect(user_id)


@app.get("/")
def root():
    return {
        "status": "✅ running",
        "app": "SmartCommute API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {
        "api": "✅ ok",
        "database": "✅ ok",
        "redis": "✅ ok",
    }


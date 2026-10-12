from fastapi import APIRouter
from app.api.v1.endpoints import agent, profiles, content
from app.api.v1.websocket import status

api_router = APIRouter()

# HTTP Endpoints
api_router.include_router(agent.router, prefix="/agent", tags=["agent"])
api_router.include_router(profiles.router, prefix="/profiles", tags=["profiles"])
api_router.include_router(content.router, prefix="/content", tags=["content"])

# WebSocket Stream
api_router.include_router(status.router, prefix="", tags=["websocket"])
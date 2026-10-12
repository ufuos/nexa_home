import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "NEXA Home Backend"
    API_V1_STR: str = "/api/v1"
    # Allow local development and Render frontend domains
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://nexa-home.onrender.com"
    ]

    class Config:
        case_sensitive = True

settings = Settings()
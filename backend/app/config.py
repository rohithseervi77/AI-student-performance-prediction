"""
EduPredict AI - Backend Configuration
Robust environment settings reading from os.environ and .env files.
"""

import os
from typing import List

# Attempt to load .env if available
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

class Settings:
    PROJECT_NAME: str = "EduPredict AI"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Database URL:
    # Supports MySQL: mysql+pymysql://<user>:<pass>@<host>:<port>/<dbname>
    # Defaults to local SQLite for portable zero-config demo if MySQL is not configured
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./edupredict.db")
    
    # JWT Auth
    JWT_SECRET: str = os.getenv("JWT_SECRET", "super-secret-academic-edupredict-key-2026-xyz-ai-token")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://0.0.0.0:3000",
        "*"
    ]

settings = Settings()

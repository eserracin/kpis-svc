from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "KPIs Service"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    APP_BASE_URL: str = os.getenv("APP_BASE_URL", "http://localhost:8002")
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:5300",
    ]
    
    # Database
    POSTGRES_SERVER: str = os.getenv("POSTGRES_SERVER", "localhost")
    POSTGRES_PORT: str = os.getenv("POSTGRES_PORT", "5434")
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "svc_kpis_user")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "svc_kpis_user")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "kpis-svc")
    
    @property
    def DATABASE_URL(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    
    # API Configuration
    API_V1_PREFIX: str = "/api/v1"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

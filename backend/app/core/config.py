"""
Application configuration management
Uses Pydantic Settings for environment variable validation
V3.0 Lightweight deployment - Render compatible
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional


class Settings(BaseSettings):
    """Application settings with validation"""

    # Environment
    ENVIRONMENT: str = "production"

    # Application
    APP_NAME: str = "AI Roadtrip Genie"
    PRICE_PER_ITINERARY: float = 12.99
    BUFFER_FUND_PERCENTAGE: int = 10

    # CORS
    CORS_ORIGINS: str = "*"

    # AI Service (required)
    GEMINI_API_KEY: str

    # Server
    PORT: int = 8000

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )

    def get_cors_origins(self) -> List[str]:
        """Parse CORS origins from string or return wildcard"""
        if self.CORS_ORIGINS == "*":
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()

"""
Application configuration management
Uses Pydantic Settings for environment variable validation
V2.3 Deployment Ready - Vercel/Render compatible
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List, Optional
import os


class Settings(BaseSettings):
    """Application settings with validation"""

    # Environment
    ENVIRONMENT: str = "development"

    # Application
    APP_NAME: str = "AI Roadtrip Genie"
    PRICE_PER_ITINERARY: float = 12.99
    BUFFER_FUND_PERCENTAGE: int = 10

    # Database (optional for initial deployment)
    DATABASE_URL: Optional[str] = None

    # Security
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # CORS - Allow all origins for initial deployment, or specify Vercel URL
    # Set CORS_ORIGINS env var as comma-separated list: "https://app.vercel.app,http://localhost:3000"
    CORS_ORIGINS: str = "*"

    # Stripe (optional - set dummy values for non-payment testing)
    STRIPE_SECRET_KEY: Optional[str] = None
    STRIPE_PUBLISHABLE_KEY: Optional[str] = None
    STRIPE_WEBHOOK_SECRET: Optional[str] = None

    # AI Service (required)
    GEMINI_API_KEY: str

    # External APIs (optional)
    GOOGLE_MAPS_API_KEY: str = ""
    WEATHER_API_KEY: str = ""

    # PDF Export
    PDF_OUTPUT_DIR: str = "./output/pdfs"

    # Server
    PORT: int = 8000

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"  # Ignore extra env vars from Render/Vercel
    )

    def get_cors_origins(self) -> List[str]:
        """Parse CORS origins from string or return wildcard"""
        if self.CORS_ORIGINS == "*":
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


settings = Settings()

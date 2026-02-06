"""
AI Roadtrip Genie - FastAPI Backend Entry Point
V3.0 - Lightweight deployment (no database, no payment)
"""
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.routes import health, itinerary


# CORS origins - add your Vercel deployment URL when deployed
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    # "https://your-app.vercel.app",
]


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    print("=" * 60)
    print("AI Roadtrip Genie Backend v3.0")
    print("=" * 60)
    print(f"Environment: {settings.ENVIRONMENT}")
    print(f"Port: {settings.PORT}")
    print(f"CORS Origins: {ALLOWED_ORIGINS}")
    print(f"Gemini API: {'Configured' if settings.GEMINI_API_KEY else 'NOT SET'}")
    print("=" * 60)

    yield

    print("Backend Shutdown Complete")


app = FastAPI(
    title="AI Roadtrip Genie API",
    description="Premium AI-powered roadtrip itinerary generator with hardcore logistics & scientific insights",
    version="3.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Register routes (no payment/database for initial launch)
app.include_router(health.router, prefix="/api/health", tags=["Health"])
app.include_router(itinerary.router, prefix="/api/itinerary", tags=["Itinerary"])


@app.get("/")
async def root():
    """Root endpoint - API health check"""
    return {
        "service": "AI Roadtrip Genie",
        "version": "3.0.0",
        "status": "operational",
        "docs": "/docs",
        "environment": settings.ENVIRONMENT
    }


@app.get("/api")
async def api_root():
    """API root endpoint"""
    return {
        "message": "AI Roadtrip Genie API",
        "version": "3.0.0",
        "endpoints": {
            "health": "/api/health",
            "generate": "/api/itinerary/generate",
            "refine": "/api/itinerary/refine"
        }
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", settings.PORT))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=settings.ENVIRONMENT == "development",
        log_level="info"
    )

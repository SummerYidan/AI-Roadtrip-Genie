"""
Itinerary generation endpoints
Core business logic for AI-powered roadtrip planning
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.itinerary import ItineraryRequest, ItineraryResponse, ItineraryRefinementRequest
from app.services.itinerary_service import ItineraryService
from app.services.ai_service import AIService

router = APIRouter()


@router.post("/generate", response_model=ItineraryResponse)
async def generate_itinerary(
    request: ItineraryRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Generate AI-powered roadtrip itinerary
    Includes: hardcore logistics, outdoor activities, scientific insights
    """
    try:
        service = ItineraryService(db)
        itinerary = await service.generate(request)
        return itinerary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{itinerary_id}", response_model=ItineraryResponse)
async def get_itinerary(
    itinerary_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Retrieve existing itinerary by ID"""
    service = ItineraryService(db)
    itinerary = await service.get_by_id(itinerary_id)

    if not itinerary:
        raise HTTPException(status_code=404, detail="Itinerary not found")

    return itinerary


@router.post("/refine", response_model=ItineraryResponse)
async def refine_itinerary(
    request: ItineraryRefinementRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Refine existing itinerary based on user feedback
    Maintains: 10% buffer fund, scientific depth, expert-level guidance
    """
    try:
        ai_service = AIService()
        refined_data = await ai_service.refine_itinerary(
            current_itinerary=request.current_itinerary,
            refinement_request=request.refinement_request
        )

        # Convert refined data to ItineraryResponse format
        # Add required fields if missing
        if "itinerary_id" not in refined_data:
            import uuid
            refined_data["itinerary_id"] = str(uuid.uuid4())
        if "created_at" not in refined_data:
            from datetime import datetime
            refined_data["created_at"] = datetime.utcnow().isoformat()
        if "payment_status" not in refined_data:
            refined_data["payment_status"] = "unpaid"

        return refined_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

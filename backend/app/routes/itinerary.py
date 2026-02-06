"""
Itinerary generation endpoints
Core business logic for AI-powered roadtrip planning
"""
from fastapi import APIRouter, HTTPException
import uuid
from datetime import datetime

from app.models.itinerary import ItineraryRequest, ItineraryResponse, ItineraryRefinementRequest
from app.services.itinerary_service import ItineraryService
from app.services.ai_service import AIService

router = APIRouter()


@router.post("/generate", response_model=ItineraryResponse)
async def generate_itinerary(request: ItineraryRequest):
    """
    Generate AI-powered roadtrip itinerary
    Includes: hardcore logistics, outdoor activities, scientific insights
    """
    try:
        service = ItineraryService()
        itinerary = await service.generate(request)
        return itinerary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/refine", response_model=ItineraryResponse)
async def refine_itinerary(request: ItineraryRefinementRequest):
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

        if "itinerary_id" not in refined_data:
            refined_data["itinerary_id"] = str(uuid.uuid4())
        if "created_at" not in refined_data:
            refined_data["created_at"] = datetime.utcnow().isoformat()
        if "payment_status" not in refined_data:
            refined_data["payment_status"] = "unpaid"

        return refined_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

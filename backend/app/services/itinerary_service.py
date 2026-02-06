"""
Itinerary generation service
Core business logic following CLAUDE.md three-axis principles:
- A. Hardcore Logistics
- B. Physical Discovery (Outdoor Activities)
- C. Intellectual Discovery (Scientific Insights)
"""
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
import uuid
from datetime import datetime

from app.models.itinerary import (
    ItineraryRequest,
    ItineraryResponse,
    LogisticsInfo,
    BudgetBreakdown,
    ActivityPoint,
    SciencePoint
)
from app.services.ai_service import AIService


class ItineraryService:
    """Service for itinerary generation and management"""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.ai_service = AIService()

    async def generate(self, request: ItineraryRequest) -> ItineraryResponse:
        """
        Generate comprehensive roadtrip itinerary using Gemini AI
        Following three-axis principles from CLAUDE.md
        """
        itinerary_id = f"itin_{uuid.uuid4().hex[:12]}"

        # REAL AI GENERATION
        print(f"[GEN] Generating itinerary with Gemini AI...")
        print(f"[GEN] From: {request.start_location} -> To: {request.end_location}")
        print(f"[GEN] Vehicle: {request.vehicle_type} | Round Trip: {request.is_round_trip}")
        print(f"[GEN] Duration: {request.trip_duration} days, starting {request.start_date}")
        print(f"[GEN] Interests: {', '.join(request.interests) if request.interests else 'None specified'}")

        # Call Gemini AI to generate itinerary
        ai_response = await self.ai_service.generate_itinerary(request)

        print(f"[GEN] Gemini AI response received!")
        print(f"[GEN] Markdown length: {len(ai_response.get('itinerary_markdown', ''))} chars")

        # Build response with AI-generated data
        response = ItineraryResponse(
            itinerary_id=itinerary_id,
            created_at=datetime.utcnow().isoformat(),

            # AI-generated content
            trip_summary=ai_response.get("trip_summary", "AI-generated itinerary"),
            season_info=ai_response.get("season_info", self._get_season_info(request.start_date)),
            itinerary_markdown=ai_response.get("itinerary_markdown", ""),

            # Structured daily data
            itinerary_daily=ai_response.get("itinerary_daily"),

            # Map data
            route_coordinates=ai_response.get("route_coordinates"),
            is_round_trip=ai_response.get("is_round_trip", request.is_round_trip),
            markers=ai_response.get("markers"),

            # Vehicle recommendation
            vehicle_recommendation=ai_response.get("vehicle_recommendation"),

            # Interest-specific highlights
            interest_highlights=ai_response.get("interest_highlights"),

            # Logistics
            logistics=LogisticsInfo(**ai_response.get("logistics", {
                "total_distance_km": 0,
                "estimated_driving_hours": 0,
                "fuel_stops": [],
                "accommodation_points": [],
                "safety_warnings": [],
                "offroad_assessment": None
            })),

            # Budget
            budget=BudgetBreakdown(**ai_response.get("budget", {
                "fuel_cost": 0.0,
                "toll_fees": 0.0,
                "accommodation": 0.0,
                "meals": 0.0,
                "activities": 0.0,
                "subtotal": 0.0,
                "buffer_fund": 0.0,
                "total": 0.0
            })),

            # Activities
            activities=[
                ActivityPoint(**activity)
                for activity in ai_response.get("activities", [])
            ],

            # Science points
            science_points=[
                SciencePoint(**point)
                for point in ai_response.get("science_points", [])
            ],

            # Warnings and packing
            risk_warnings=ai_response.get("risk_warnings", []),
            packing_list=ai_response.get("packing_list", []),

            payment_status="pending"
        )

        print(f"[GEN] Itinerary {itinerary_id} generated successfully!")

        # TODO: Save to database

        return response

    async def get_by_id(self, itinerary_id: str) -> Optional[ItineraryResponse]:
        """Retrieve itinerary from database"""
        # TODO: Implement database query
        return None

    def _get_season_info(self, start_date) -> str:
        """Determine season and provide relevant warnings"""
        month = start_date.month

        if month in [12, 1, 2]:
            return "Winter - Check snow conditions, carry chains"
        elif month in [3, 4, 5]:
            return "Spring - Variable weather, road conditions may vary"
        elif month in [6, 7, 8]:
            return "Summer - Peak season, high temperatures possible"
        else:
            return "Fall - Beautiful foliage, prepare for cooler weather"

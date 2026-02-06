"""
Itinerary Pydantic models - English Professional Version
Request/Response schemas following CLAUDE.md specifications
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date
from enum import Enum


class VehicleType(str, Enum):
    """Vehicle type classifications"""
    SEDAN = "sedan"
    SUV = "suv"
    CROSSOVER = "crossover"
    TRUCK = "truck"
    VAN = "van"


class ActivityLevel(str, Enum):
    """Outdoor activity difficulty levels"""
    EASY = "easy"
    MODERATE = "moderate"
    CHALLENGING = "challenging"
    EXPERT = "expert"


class InterestCategory(str, Enum):
    """V2.0 - 8 fixed interest categories"""
    PHOTOGRAPHY = "photography"
    GEOLOGY = "geology"
    HIKING = "hiking"
    LOCAL_FOOD = "local_food"
    HISTORY = "history"
    ARCHITECTURE = "architecture"
    ADVENTURE_SPORTS = "adventure_sports"
    WELLNESS = "wellness"


class ItineraryRequest(BaseModel):
    """Request model for itinerary generation - English version"""

    # Basic trip info
    start_location: str = Field(..., description="Starting point (city, state)")
    end_location: str = Field(..., description="Adventure destination")
    trip_duration: int = Field(..., ge=1, le=30, description="Trip duration in days")
    start_date: date = Field(..., description="Trip start date")
    number_of_persons: int = Field(2, ge=1, le=12, description="Number of travelers")

    # Round trip option
    is_round_trip: bool = Field(False, description="Whether the trip returns to start location")

    # Vehicle type (no specific model - AI recommends)
    vehicle_type: VehicleType = VehicleType.SUV

    # User preferences
    interests: List[InterestCategory] = Field(default_factory=list)
    activity_level: ActivityLevel = ActivityLevel.MODERATE

    # Special requirements
    include_offroad: bool = Field(False, description="Include off-road sections")

    class Config:
        json_schema_extra = {
            "example": {
                "start_location": "Seattle, WA",
                "end_location": "Yellowstone National Park",
                "trip_duration": 5,
                "start_date": "2025-06-15",
                "number_of_persons": 2,
                "is_round_trip": True,
                "vehicle_type": "suv",
                "interests": ["photography", "geology", "hiking", "local_food"],
                "activity_level": "moderate",
                "include_offroad": False
            }
        }


class ItineraryRefinementRequest(BaseModel):
    """Request model for refining an existing itinerary"""
    current_itinerary: dict = Field(..., description="Current itinerary JSON to refine")
    refinement_request: str = Field(..., description="Modification request in English")


class LogisticsInfo(BaseModel):
    """Logistics information"""
    total_distance_km: float = 0
    estimated_driving_hours: float = 0
    fuel_stops: List[dict] = Field(default_factory=list)
    accommodation_points: List[dict] = Field(default_factory=list)
    safety_warnings: List[str] = Field(default_factory=list)


class BudgetBreakdown(BaseModel):
    """Budget with mandatory 10% buffer fund"""
    fuel_cost: float = 0
    toll_fees: float = 0
    accommodation: float = 0
    meals: float = 0
    activities: float = 0
    subtotal: float = 0
    buffer_fund: float = 0  # 10% of subtotal (Risk Reserve)
    total: float = 0


class ActivityPoint(BaseModel):
    """Outdoor activity with difficulty rating"""
    name: str
    type: str
    difficulty_class: int = Field(1, ge=1, le=5)
    elevation_gain_m: Optional[float] = None
    estimated_duration_hours: Optional[float] = None
    terrain_description: str = ""
    gear_checklist: List[str] = Field(default_factory=list)


class SciencePoint(BaseModel):
    """Scientific observation point"""
    name: str
    category: str = "general"
    coordinates: dict = Field(default_factory=dict)
    scientific_explanation: str = ""
    observation_tips: str = ""


class ItineraryResponse(BaseModel):
    """Response model for generated itinerary"""

    itinerary_id: str
    created_at: str

    # Trip overview
    trip_summary: str
    season_info: str

    # Core content
    itinerary_markdown: str = ""

    # Structured daily data
    itinerary_daily: Optional[List[dict]] = None

    # Map data
    route_coordinates: Optional[List[dict]] = None
    is_round_trip: Optional[bool] = None
    markers: Optional[List[dict]] = None

    # Vehicle recommendation
    vehicle_recommendation: Optional[dict] = None

    # Interest-specific highlights (array of {category, advice} objects)
    interest_highlights: Optional[List[dict]] = None

    # Structured data
    logistics: LogisticsInfo = Field(default_factory=LogisticsInfo)
    budget: BudgetBreakdown = Field(default_factory=BudgetBreakdown)
    activities: List[ActivityPoint] = Field(default_factory=list)
    science_points: List[SciencePoint] = Field(default_factory=list)

    # Safety & tips
    risk_warnings: List[str] = Field(default_factory=list)
    packing_list: List[str] = Field(default_factory=list)

    payment_status: str = "pending"

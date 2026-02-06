"""
AI Service - V2.0 Final Professional Version
Gemini 2.5 Flash with morning/afternoon/evening structure, scaled budgeting, universal expertise
"""
import google.generativeai as genai
from typing import Dict, Any, List
import json
import asyncio
import re
from app.core.config import settings
from app.models.itinerary import ItineraryRequest


class AIService:
    """AI-powered itinerary generation using Gemini with enforced schema"""

    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)

    def _build_schema(self, user_interests: List[str]) -> dict:
        """V2.0 Schema with morning/afternoon/evening partitioning for stability"""

        return {
            "type": "object",
            "properties": {
                "trip_summary": {
                    "type": "string",
                    "description": "1-2 sentence trip overview (max 100 chars)"
                },
                "season_info": {
                    "type": "string",
                    "description": "Season-specific safety advisory (max 80 chars)"
                },
                "vehicle_recommendation": {
                    "type": "object",
                    "description": "Vehicle specs and safety gear for this route",
                    "properties": {
                        "drivetrain": {"type": "string", "description": "e.g. AWD, 4WD, FWD"},
                        "clearance": {"type": "string", "description": "e.g. High Clearance 8\"+, Standard 6\""},
                        "safety_gear": {"type": "array", "items": {"type": "string"}, "description": "e.g. Snow Socks, Recovery Kit"},
                        "notes": {"type": "string", "description": "Additional vehicle notes (max 100 chars)"}
                    },
                    "required": ["drivetrain", "clearance", "safety_gear", "notes"]
                },
                "days": {
                    "type": "array",
                    "description": "Day-by-day plan with morning/afternoon/evening structure",
                    "items": {
                        "type": "object",
                        "properties": {
                            "day_number": {"type": "integer"},
                            "location": {"type": "string", "description": "Location name (max 25 chars)"},
                            "image_keyword": {"type": "string", "description": "Unsplash keyword e.g. 'yosemite valley'"},
                            "morning": {
                                "type": "object",
                                "properties": {
                                    "start_time": {"type": "string", "description": "24h format e.g. 06:30"},
                                    "duration_minutes": {"type": "integer"},
                                    "activity": {"type": "string", "description": "What to do (max 120 words)"},
                                    "photo_tip": {"type": "string", "description": "f-stop, ISO, shutter for this light (max 60 chars)"}
                                },
                                "required": ["start_time", "duration_minutes", "activity", "photo_tip"]
                            },
                            "afternoon": {
                                "type": "object",
                                "properties": {
                                    "start_time": {"type": "string", "description": "24h format e.g. 13:00"},
                                    "duration_minutes": {"type": "integer"},
                                    "activity": {"type": "string", "description": "What to do (max 120 words)"},
                                    "logistics": {"type": "string", "description": "Driving, fuel, road conditions (max 80 chars)"}
                                },
                                "required": ["start_time", "duration_minutes", "activity", "logistics"]
                            },
                            "evening": {
                                "type": "object",
                                "properties": {
                                    "start_time": {"type": "string", "description": "24h format e.g. 18:00"},
                                    "duration_minutes": {"type": "integer"},
                                    "activity": {"type": "string", "description": "What to do (max 120 words)"},
                                    "dining_tip": {"type": "string", "description": "Restaurant or food recommendation (max 60 chars)"}
                                },
                                "required": ["start_time", "duration_minutes", "activity", "dining_tip"]
                            },
                            "daily_driving_time": {"type": "string", "description": "e.g. 3.5 hrs"},
                            "vehicle_safety": {"type": "string", "description": "Road surface, clearance, hazards (max 80 chars)"},
                            "daily_budget_per_person": {"type": "number", "description": "Daily spend per person in USD"},
                            "accommodation_search_query": {"type": "string", "description": "Hotel search e.g. 'Mountain lodge parking, Jackson WY'"},
                            "viator_activity_query": {"type": "string", "description": "Tour search e.g. 'Sunrise photo tour Yellowstone'"}
                        },
                        "required": ["day_number", "location", "image_keyword", "morning", "afternoon", "evening", "daily_driving_time", "vehicle_safety", "daily_budget_per_person", "accommodation_search_query", "viator_activity_query"]
                    }
                },
                "interest_highlights": {
                    "type": "array",
                    "description": "Expert tips for selected interests. Must have at least 1 entry. If no interests selected, generate one for 'general'.",
                    "minItems": 1,
                    "items": {
                        "type": "object",
                        "properties": {
                            "category": {"type": "string", "description": "Interest name"},
                            "advice": {"type": "string", "description": "Expert advice (max 120 chars)"}
                        },
                        "required": ["category", "advice"]
                    }
                },
                "logistics": {
                    "type": "object",
                    "properties": {
                        "total_distance_km": {"type": "number"},
                        "estimated_driving_hours": {"type": "number"},
                        "fuel_stops": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "day": {"type": "integer"},
                                    "location": {"type": "string"},
                                    "coordinates": {
                                        "type": "object",
                                        "properties": {"lat": {"type": "number"}, "lon": {"type": "number"}},
                                        "required": ["lat", "lon"]
                                    }
                                },
                                "required": ["day", "location", "coordinates"]
                            }
                        },
                        "accommodation_points": {
                            "type": "array",
                            "items": {
                                "type": "object",
                                "properties": {
                                    "night": {"type": "integer"},
                                    "name": {"type": "string"},
                                    "type": {"type": "string"}
                                },
                                "required": ["night", "name", "type"]
                            }
                        },
                        "safety_warnings": {"type": "array", "items": {"type": "string"}}
                    },
                    "required": ["total_distance_km", "estimated_driving_hours", "fuel_stops", "accommodation_points", "safety_warnings"]
                },
                "budget_table": {
                    "type": "object",
                    "description": "Budget calculated for given number of persons",
                    "properties": {
                        "number_of_persons": {"type": "integer"},
                        "fuel_cost": {"type": "number", "description": "Fixed cost - same regardless of persons"},
                        "toll_fees": {"type": "number", "description": "Fixed cost"},
                        "accommodation": {"type": "number", "description": "Scaled by persons"},
                        "meals": {"type": "number", "description": "Scaled by persons"},
                        "activities": {"type": "number", "description": "Scaled by persons"},
                        "subtotal": {"type": "number"},
                        "buffer_fund": {"type": "number", "description": "10% risk reserve = subtotal * 0.1"},
                        "total": {"type": "number", "description": "subtotal + buffer_fund"}
                    },
                    "required": ["number_of_persons", "fuel_cost", "toll_fees", "accommodation", "meals", "activities", "subtotal", "buffer_fund", "total"]
                },
                "markers": {
                    "type": "array",
                    "description": "Key map markers (max 6)",
                    "items": {
                        "type": "object",
                        "properties": {
                            "sequence": {"type": "integer"},
                            "name": {"type": "string"},
                            "type": {"type": "string", "enum": ["fuel", "accommodation", "scenic_spot", "trailhead", "viewpoint", "restaurant"]},
                            "coordinates": {
                                "type": "object",
                                "properties": {"lat": {"type": "number"}, "lon": {"type": "number"}},
                                "required": ["lat", "lon"]
                            }
                        },
                        "required": ["sequence", "name", "type", "coordinates"]
                    }
                },
                "route_coordinates": {
                    "type": "array",
                    "description": "Route polyline (max 12 points). If round trip, last point = first point.",
                    "items": {
                        "type": "object",
                        "properties": {"lat": {"type": "number"}, "lon": {"type": "number"}},
                        "required": ["lat", "lon"]
                    }
                },
                "is_round_trip": {"type": "boolean"},
                "risk_warnings": {"type": "array", "items": {"type": "string"}, "description": "Max 3 warnings"},
                "packing_list": {"type": "array", "items": {"type": "string"}, "description": "Max 5 items"}
            },
            "required": [
                "trip_summary", "season_info", "vehicle_recommendation", "days",
                "interest_highlights", "logistics", "budget_table", "markers",
                "route_coordinates", "is_round_trip", "risk_warnings", "packing_list"
            ]
        }

    def _get_model(self, user_interests: List[str]):
        """Create model with V2.0 schema"""
        response_schema = self._build_schema(user_interests)

        return genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            generation_config={
                "temperature": 0.7,
                "top_p": 0.95,
                "top_k": 40,
                "max_output_tokens": 8192,
                "response_mime_type": "application/json",
                "response_schema": response_schema
            },
            system_instruction=self._get_system_prompt()
        )

    def _repair_json_string(self, json_str: str) -> str:
        """Advanced JSON repair for AI-generated formatting issues"""
        json_str = re.sub(r',(\s*[}\]])', r'\1', json_str)

        open_braces = json_str.count('{') - json_str.count('}')
        open_brackets = json_str.count('[') - json_str.count(']')

        if open_brackets > 0:
            json_str += ']' * open_brackets
        if open_braces > 0:
            json_str += '}' * open_braces

        json_str = re.sub(r'[\x00-\x1f\x7f-\x9f]', '', json_str)

        return json_str

    def _defensive_json_cleanup(self, text: str) -> str:
        """Defensive cleanup with force-completion for truncated JSON"""
        text = re.sub(r'^```json\s*', '', text.strip())
        text = re.sub(r'\s*```$', '', text.strip())

        if '\n' in text:
            text = text.replace('\n', ' ').replace('\r', ' ')
            text = re.sub(r' +', ' ', text)

        text = text.strip()
        if text and not text.endswith('}'):
            print(f"[JSON REPAIR] Truncated response detected - force completing...")
            last_quote = text.rfind('"')
            last_brace = text.rfind('}')
            last_bracket = text.rfind(']')

            if last_quote > max(last_brace, last_bracket):
                text = text[:last_quote + 1]

            open_braces = text.count('{') - text.count('}')
            open_brackets = text.count('[') - text.count(']')

            if open_brackets > 0:
                text += ']' * open_brackets
            if open_braces > 0:
                text += '}' * open_braces

        return text

    async def generate_itinerary(self, request: ItineraryRequest) -> Dict[str, Any]:
        """Generate itinerary using Gemini API with structured JSON output"""
        prompt = self._build_prompt(request)
        user_interests = [str(i) for i in request.interests] if request.interests else []
        model = self._get_model(user_interests)

        try:
            response = await asyncio.to_thread(model.generate_content, prompt)
            response_text = response.text

            print(f"\n{'='*60}")
            print(f"[GEMINI V2.0] Response length: {len(response_text)} chars")
            print(f"[GEMINI V2.0] First 500 chars: {response_text[:500]}")
            print(f"{'='*60}\n")

            cleaned = self._defensive_json_cleanup(response_text)

            try:
                data = json.loads(cleaned)
            except json.JSONDecodeError as e:
                print(f"[JSON ERROR] Initial parse failed at pos {e.pos}: {e.msg}")
                repaired = self._repair_json_string(cleaned)
                try:
                    data = json.loads(repaired)
                    print("[JSON REPAIR] Success after repair")
                except json.JSONDecodeError as e2:
                    start = repaired.find('{')
                    end = repaired.rfind('}') + 1
                    if start >= 0 and end > start:
                        data = json.loads(repaired[start:end])
                        print("[JSON REPAIR] Success via boundary extraction")
                    else:
                        raise ValueError(f"All JSON repair failed: {e2}")

            # Ensure interest_highlights is never empty (prevents 400 schema errors)
            if not data.get("interest_highlights"):
                fallback_category = user_interests[0] if user_interests else "general"
                data["interest_highlights"] = [
                    {"category": fallback_category, "advice": "Enjoy the journey and stay flexible with your schedule."}
                ]

            # Normalize: map "days" -> "itinerary_daily" for frontend compatibility
            if "days" in data:
                data["itinerary_daily"] = data.pop("days")

            # Generate markdown from daily data (V2.0 morning/afternoon/evening format)
            if "itinerary_daily" in data:
                md_parts = []
                for day in data["itinerary_daily"]:
                    n = day.get("day_number", 1)
                    loc = day.get("location", "")
                    morning = day.get("morning", {})
                    afternoon = day.get("afternoon", {})
                    evening = day.get("evening", {})
                    driving = day.get("daily_driving_time", "")
                    budget = day.get("daily_budget_per_person", 0)

                    md_parts.append(
                        f"## Day {n}: {loc}\n\n"
                        f"**Morning ({morning.get('start_time', '07:00')})**: {morning.get('activity', '')}\n"
                        f"*Photo Tip: {morning.get('photo_tip', '')}*\n\n"
                        f"**Afternoon ({afternoon.get('start_time', '13:00')})**: {afternoon.get('activity', '')}\n"
                        f"*Logistics: {afternoon.get('logistics', '')}*\n\n"
                        f"**Evening ({evening.get('start_time', '18:00')})**: {evening.get('activity', '')}\n"
                        f"*Dining: {evening.get('dining_tip', '')}*\n\n"
                        f"**Driving**: {driving} | **Budget/person**: ${budget:.0f}\n\n"
                    )
                data["itinerary_markdown"] = "\n".join(md_parts)

            # Map budget_table -> budget with 10% buffer enforcement
            if "budget_table" in data:
                data["budget"] = data.pop("budget_table")
                budget = data["budget"]
                expected = round(budget.get("subtotal", 0) * 0.1, 2)
                actual = budget.get("buffer_fund", 0)
                if abs(expected - actual) > 0.01:
                    budget["buffer_fund"] = expected
                    budget["total"] = budget["subtotal"] + expected

            # Extract science points from markers
            if "markers" in data:
                data["science_points"] = [
                    m for m in data["markers"]
                    if m.get("type") in ["scenic_spot", "viewpoint"]
                ]

            return data

        except Exception as e:
            print(f"[ERROR] Gemini API: {e}")
            raise ValueError(f"Failed to generate itinerary: {e}")

    async def refine_itinerary(self, current_itinerary: dict, refinement_request: str) -> Dict[str, Any]:
        """Refine an existing itinerary based on user feedback"""
        prompt = f"""You are an expert road trip planner. The user wants to modify their itinerary.

**User's Request**: {refinement_request}

**Current Itinerary (JSON)**:
```json
{json.dumps(current_itinerary, ensure_ascii=False, indent=2)[:3000]}
```

**Rules**:
1. Keep 10% buffer_fund = subtotal * 0.1
2. Keep interest_highlights as non-empty array
3. Each field max 120 words
4. Total JSON under 8000 chars
5. Photography tips: use universal params (f-stop, ISO, shutter) - NO camera brands
6. Maintain morning/afternoon/evening structure

Generate the modified complete itinerary JSON:"""

        try:
            user_interests = [h.get("category", "general") for h in (current_itinerary.get("interest_highlights") or [])]
            model = self._get_model(user_interests)

            response = await asyncio.to_thread(model.generate_content, prompt)
            cleaned = self._defensive_json_cleanup(response.text)

            try:
                data = json.loads(cleaned)
            except json.JSONDecodeError:
                data = json.loads(self._repair_json_string(cleaned))

            # Ensure interest_highlights is never empty
            if not data.get("interest_highlights"):
                fallback_category = user_interests[0] if user_interests else "general"
                data["interest_highlights"] = [
                    {"category": fallback_category, "advice": "Enjoy the journey and stay flexible with your schedule."}
                ]

            if "days" in data:
                data["itinerary_daily"] = data.pop("days")

            if "budget_table" in data:
                data["budget"] = data.pop("budget_table")
                budget = data["budget"]
                budget["buffer_fund"] = round(budget.get("subtotal", 0) * 0.1, 2)
                budget["total"] = budget["subtotal"] + budget["buffer_fund"]

            if "markers" in data:
                data["science_points"] = [m for m in data["markers"] if m.get("type") in ["scenic_spot", "viewpoint"]]

            return data
        except Exception as e:
            raise ValueError(f"Failed to refine itinerary: {e}")

    def _get_system_prompt(self) -> str:
        """V2.0 system prompt - universal expertise, scaled budgeting, stability"""
        return """You are a world-class road trip expedition expert. Generate professional itineraries with precision.

CRITICAL RULES:
1. ALL output in English
2. Each text field MAX 120 words to prevent JSON truncation
3. Total JSON MUST NOT exceed 8000 characters
4. budget_table.buffer_fund = subtotal * 0.1 (MANDATORY 10% risk reserve)
5. If round trip, route_coordinates MUST loop back to start (last point = first point)
6. Photography: use UNIVERSAL parameters (f/X, 1/Xs shutter, ISO XXX, focal length mm). NEVER mention camera brands (Sony, Fuji, Canon, Nikon)
7. Vehicle: recommend drivetrain (AWD/4WD), clearance (e.g. "8+ inches"), safety gear (Snow Socks, Recovery Kit)
8. interest_highlights: MUST be non-empty array. Generate at least 1 object for "general" if no interests selected.
9. ALL fields must have non-empty values to avoid 400 schema errors.

MORNING/AFTERNOON/EVENING STRUCTURE:
10. Each day has 3 time blocks: morning, afternoon, evening
11. Each block has: start_time (24h), duration_minutes, activity description
12. Morning: Include photo_tip with camera settings for morning light
13. Afternoon: Include logistics (driving, fuel, road info)
14. Evening: Include dining_tip with restaurant/food recommendation

SCALED BUDGETING:
15. Fixed costs (fuel_cost, toll_fees) stay the same regardless of persons
16. Variable costs (accommodation, meals, activities) scale with number_of_persons
17. daily_budget_per_person = per-person daily spend (variable costs only)
18. Total budget = fixed_costs + (variable_per_person * persons)

GOLDEN HOUR SCHEDULING:
19. Photography activities at sunrise (06:00-07:30) or sunset (18:00-20:00)
20. If snow gear or high clearance required, schedule later start times (08:00+)

OUTPUT STRUCTURE:
- days: Array with morning{}, afternoon{}, evening{} per day
- vehicle_recommendation: drivetrain, clearance, safety_gear[], notes
- interest_highlights: ARRAY of {category, advice} - MUST have ≥1 entry
- markers: Max 6 waypoints with coordinates
- route_coordinates: Max 12 points for polyline
- budget_table: number_of_persons, fixed costs, scaled costs, subtotal, buffer_fund (10%), total
- risk_warnings: Max 3
- packing_list: Max 5 items"""

    def _build_prompt(self, request: ItineraryRequest) -> str:
        """Build V2.0 user prompt with scaled budgeting"""
        interests = ", ".join(request.interests) if request.interests else "general sightseeing"
        level_map = {"easy": "Easy", "moderate": "Moderate", "challenging": "Challenging", "expert": "Expert"}
        level = level_map.get(request.activity_level, "Moderate")
        round_trip = "Yes (loop route back to start, include return fuel/tolls)" if request.is_round_trip else "No (one-way)"
        persons = getattr(request, 'number_of_persons', 2)

        return f"""Generate a professional road trip itinerary. Total JSON under 8000 chars.

TRIP DETAILS:
- From: {request.start_location}
- To: {request.end_location}
- Duration: {request.trip_duration} days, departing {request.start_date}
- Number of Travelers: {persons}
- Round Trip: {round_trip}
- Vehicle Class: {request.vehicle_type}
- Interests: {interests}
- Activity Level: {level}
- Off-road: {"Yes" if request.include_offroad else "No"}

REQUIREMENTS:

1. DAILY STRUCTURE (each day):
   - morning: {{start_time, duration_minutes, activity (max 120 words), photo_tip (f-stop/ISO/shutter for morning light)}}
   - afternoon: {{start_time, duration_minutes, activity (max 120 words), logistics (driving/fuel info)}}
   - evening: {{start_time, duration_minutes, activity (max 120 words), dining_tip (restaurant recommendation)}}
   - daily_driving_time, vehicle_safety, daily_budget_per_person
   - accommodation_search_query, viator_activity_query
   - image_keyword: single keyword for Unsplash (e.g. "yosemite", "yellowstone", "grand canyon")

2. SCALED BUDGET (for {persons} persons):
   - Fixed costs: fuel_cost, toll_fees (same regardless of person count)
   - Variable costs: accommodation, meals, activities (multiply by {persons})
   - subtotal = fuel_cost + toll_fees + accommodation + meals + activities
   - buffer_fund = subtotal * 0.1 (10% Risk Reserve)
   - total = subtotal + buffer_fund

3. UNIVERSAL EXPERTISE:
   - Photography: f/8-f/16 for landscapes, 1/125s+ for handheld, ISO 100-400. NO brand names.
   - Vehicle: Recommend AWD/4WD, clearance (e.g. "High Clearance 8+"), safety gear (Snow Socks, Chains)

4. interest_highlights: Generate advice for: [{interests}]. MUST be non-empty array.

5. markers: Max 6 key locations with lat/lon coordinates

6. route_coordinates: Max 12 points for map polyline
{"7. ROUND TRIP: Last coordinate MUST equal first coordinate. Budget includes return fuel/tolls." if request.is_round_trip else ""}

8. ALL fields must be non-empty to avoid schema errors.

Generate the complete JSON itinerary:"""

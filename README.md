# AI Roadtrip Genie

> Premium AI-powered road trip itinerary platform — $12.99 per itinerary
> **Hardcore Logistics** + **Outdoor Adventure** + **Geological Insights**

---

## Overview

AI Roadtrip Genie delivers expert-level road trip planning with the confidence of a professional expedition leader. The platform deeply integrates **vehicle logistics, outdoor exploration, and natural science education** to solve real pain points in trip planning, safety, and immersive experience.

### Core Pillars (Three-Axis Design)

#### A. Hardcore Logistics
- Vehicle class assessment with drivetrain and clearance recommendations
- Seasonal safety advisories (snow chains, black ice, wildlife hazards)
- Precision budgeting with mandatory 10% buffer fund (risk reserve)
- Fuel stops and accommodation waypoints with GPS coordinates

#### B. Physical Discovery (Outdoor Activities)
- Trail difficulty ratings (Class 1-5) with elevation gain and estimated duration
- Dynamic activity matching based on user interests (skiing, bouldering, etc.)
- Professional gear checklists

#### C. Intellectual Discovery (Scientific Narrative)
- Geological, ecological, and astronomical insights for every major landmark
- Science observation points marked along the route
- "Learn while you drive" deep-value content

---

## Architecture

```
ai-roadtrip-genie/
├── CLAUDE.md                 # Project constitution (dev guidelines)
├── backend/                  # FastAPI backend
│   ├── main.py              # Application entry point
│   ├── app/
│   │   ├── core/            # Configuration & database
│   │   ├── models/          # Pydantic data models
│   │   ├── routes/          # API endpoints
│   │   └── services/        # Business logic & AI integration
│   └── requirements.txt     # Python dependencies
└── frontend/                # Next.js frontend
    ├── app/
    │   ├── page.tsx         # Home page (input form)
    │   └── result/
    │       └── page.tsx     # Result page (itinerary display)
    └── package.json         # Node dependencies
```

---

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 14+ (optional — works without it during development)

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your GEMINI_API_KEY

# Start server
python main.py
```

**Backend**: http://localhost:8000
**API Docs**: http://localhost:8000/docs

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local

# Start dev server
npm run dev
```

**Frontend**: http://localhost:3000

---

## Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.11+, async/await)
- **AI Engine**: Google Gemini 2.5 Flash (structured JSON output)
- **Validation**: Pydantic v2
- **Database**: PostgreSQL + SQLAlchemy (async)
- **Payment**: Stripe API (Checkout mode)
- **PDF Export**: WeasyPrint

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts (budget pie chart)
- **Maps**: Leaflet + React Leaflet
- **Icons**: Lucide React

### Design
- **Inspiration**: Arc'teryx, National Geographic
- **Palette**: Carbon dark `#1A1A1A`, Off-white `#F5F5F0`, Forest green `#2D5F3F`
- **Style**: Minimalist, premium, outdoor aesthetic

---

## API Endpoints

### Generate Itinerary
```http
POST /api/itinerary/generate
Content-Type: application/json

{
  "start_location": "Seattle, WA",
  "end_location": "Yellowstone National Park",
  "trip_duration": 5,
  "start_date": "2025-06-15",
  "number_of_persons": 2,
  "is_round_trip": true,
  "vehicle_type": "suv",
  "interests": ["photography", "geology", "hiking"],
  "activity_level": "moderate",
  "include_offroad": false
}
```

### Refine Itinerary
```http
POST /api/itinerary/refine
Content-Type: application/json

{
  "current_itinerary": { ... },
  "refinement_request": "Add more photography stops and reduce budget to $800"
}
```

### Health Check
```http
GET /api/health
```

---

## Key Features

| Feature | Description |
|---------|-------------|
| Morning/Afternoon/Evening Structure | Each day is split into 3 time blocks with tailored activities |
| Universal Photography Guide | Camera settings (f-stop, ISO, shutter) for golden hour — no brand names |
| Scaled Budgeting | Fixed costs (fuel, tolls) + variable costs scaled by traveler count |
| 10% Buffer Fund | Mandatory risk reserve automatically calculated |
| Interactive Route Map | Leaflet map with numbered markers, polyline route, round-trip support |
| Genie Assistant | In-app AI refinement dialog to adjust the itinerary post-generation |
| Booking Integration | Direct search links to Booking.com and Viator for accommodation and tours |

---

## Roadmap

### Backend
- [ ] PostgreSQL database persistence
- [ ] WeasyPrint PDF export (system dependencies)
- [ ] Stripe Checkout payment flow
- [ ] User authentication system
- [ ] Rate limiting and caching

### Frontend
- [ ] Mobile responsive optimization
- [ ] Payment integration (Stripe Checkout)
- [ ] PDF download functionality
- [ ] Itinerary history management
- [ ] SEO optimization

---

## Business Model

- **Pricing**: $12.99 per itinerary (one-time purchase, lifetime access)
- **Payment**: Stripe Checkout
- **Deliverable**: Structured itinerary + publication-quality PDF
- **Target**: Quality-conscious travelers seeking premium expedition planning

---

## License

Proprietary - All Rights Reserved

---

Built with Google Gemini 2.5 Flash | Expert Expedition Planning | $12.99 per itinerary

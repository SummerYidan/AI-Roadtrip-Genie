"""
Payment Pydantic models
Stripe integration schemas
"""
from pydantic import BaseModel, Field
from typing import Optional


class PaymentRequest(BaseModel):
    """Request model for payment session creation"""

    itinerary_id: str = Field(..., description="Itinerary ID to purchase")
    customer_email: str = Field(..., description="Customer email for receipt")
    success_url: str = Field(..., description="URL to redirect after successful payment")
    cancel_url: str = Field(..., description="URL to redirect if payment cancelled")

    class Config:
        json_schema_extra = {
            "example": {
                "itinerary_id": "itin_abc123",
                "customer_email": "user@example.com",
                "success_url": "https://roadtripgenie.com/success",
                "cancel_url": "https://roadtripgenie.com/cancel"
            }
        }


class PaymentResponse(BaseModel):
    """Response model for payment session"""

    session_id: str
    checkout_url: str
    amount: float = 12.99
    currency: str = "usd"

    class Config:
        json_schema_extra = {
            "example": {
                "session_id": "cs_test_123",
                "checkout_url": "https://checkout.stripe.com/...",
                "amount": 12.99,
                "currency": "usd"
            }
        }

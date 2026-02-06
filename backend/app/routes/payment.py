"""
Payment endpoints using Stripe
Handles $12.99 per itinerary transactions
"""
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.payment import PaymentRequest, PaymentResponse
from app.services.payment_service import PaymentService

router = APIRouter()


@router.post("/create-checkout-session", response_model=PaymentResponse)
async def create_checkout_session(
    request: PaymentRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Create Stripe Checkout session for itinerary purchase
    Price: $12.99 per itinerary
    """
    try:
        service = PaymentService(db)
        session = await service.create_checkout_session(request)
        return session
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Handle Stripe webhook events
    Processes payment confirmation and failures
    """
    try:
        payload = await request.body()
        sig_header = request.headers.get("stripe-signature")

        service = PaymentService(db)
        await service.handle_webhook(payload, sig_header)

        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

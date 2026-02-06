"""
Payment service using Stripe API
Handles $12.99 per itinerary transactions
"""
from sqlalchemy.ext.asyncio import AsyncSession
import stripe

from app.core.config import settings
from app.models.payment import PaymentRequest, PaymentResponse

# Initialize Stripe
stripe.api_key = settings.STRIPE_SECRET_KEY


class PaymentService:
    """Service for payment processing"""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_checkout_session(self, request: PaymentRequest) -> PaymentResponse:
        """
        Create Stripe Checkout session
        Fixed price: $12.99 per itinerary
        """
        try:
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                line_items=[
                    {
                        "price_data": {
                            "currency": "usd",
                            "product_data": {
                                "name": "AI Roadtrip Itinerary",
                                "description": f"Premium AI-generated roadtrip plan (ID: {request.itinerary_id})",
                            },
                            "unit_amount": int(settings.PRICE_PER_ITINERARY * 100),  # Convert to cents
                        },
                        "quantity": 1,
                    }
                ],
                mode="payment",
                success_url=request.success_url,
                cancel_url=request.cancel_url,
                customer_email=request.customer_email,
                metadata={
                    "itinerary_id": request.itinerary_id
                }
            )

            return PaymentResponse(
                session_id=session.id,
                checkout_url=session.url,
                amount=settings.PRICE_PER_ITINERARY,
                currency="usd"
            )
        except Exception as e:
            raise Exception(f"Failed to create checkout session: {str(e)}")

    async def handle_webhook(self, payload: bytes, sig_header: str):
        """
        Handle Stripe webhook events
        Processes payment.succeeded, payment.failed, etc.
        """
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, settings.STRIPE_WEBHOOK_SECRET
            )

            # Handle different event types
            if event["type"] == "checkout.session.completed":
                session = event["data"]["object"]
                itinerary_id = session["metadata"]["itinerary_id"]

                # TODO: Update itinerary payment status in database
                # await self._update_payment_status(itinerary_id, "completed")

            elif event["type"] == "payment_intent.payment_failed":
                # TODO: Handle payment failure
                pass

            return {"status": "processed"}

        except ValueError as e:
            raise Exception("Invalid payload")
        except stripe.error.SignatureVerificationError as e:
            raise Exception("Invalid signature")

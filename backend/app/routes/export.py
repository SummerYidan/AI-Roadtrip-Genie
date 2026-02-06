"""
Export endpoints for PDF generation
Converts Markdown itinerary to publication-quality PDF
"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.export_service import ExportService

router = APIRouter()


@router.get("/pdf/{itinerary_id}")
async def export_to_pdf(
    itinerary_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    Export itinerary to PDF using WeasyPrint
    Returns publication-quality PDF roadbook
    """
    try:
        service = ExportService(db)
        pdf_path = await service.generate_pdf(itinerary_id)

        return FileResponse(
            pdf_path,
            media_type="application/pdf",
            filename=f"roadtrip_{itinerary_id}.pdf"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

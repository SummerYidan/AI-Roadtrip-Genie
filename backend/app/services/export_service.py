"""
Export service for PDF generation
Uses WeasyPrint to convert Markdown to publication-quality PDF
"""
from sqlalchemy.ext.asyncio import AsyncSession
from weasyprint import HTML, CSS
from pathlib import Path
import markdown
from typing import Optional

from app.core.config import settings


class ExportService:
    """Service for exporting itineraries to PDF"""

    def __init__(self, db: AsyncSession):
        self.db = db
        self.output_dir = Path(settings.PDF_OUTPUT_DIR)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    async def generate_pdf(self, itinerary_id: str) -> str:
        """
        Generate publication-quality PDF from Markdown itinerary
        Returns path to generated PDF file
        """
        # TODO: Retrieve itinerary from database
        # itinerary = await self._get_itinerary(itinerary_id)

        # Placeholder markdown content
        markdown_content = """
        # AI Roadtrip Genie

        ## Your Premium Roadtrip Itinerary

        Generated with expert-level logistics and scientific insights.
        """

        # Convert Markdown to HTML
        html_content = markdown.markdown(
            markdown_content,
            extensions=['extra', 'codehilite', 'tables']
        )

        # Wrap in HTML template with styling
        full_html = self._create_html_template(html_content)

        # Generate PDF
        pdf_path = self.output_dir / f"roadtrip_{itinerary_id}.pdf"
        HTML(string=full_html).write_pdf(
            pdf_path,
            stylesheets=[self._get_pdf_styles()]
        )

        return str(pdf_path)

    def _create_html_template(self, content: str) -> str:
        """Create styled HTML template for PDF"""
        return f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>AI Roadtrip Genie - Itinerary</title>
        </head>
        <body>
            <div class="container">
                {content}
            </div>
        </body>
        </html>
        """

    def _get_pdf_styles(self) -> CSS:
        """Define CSS styles for PDF export"""
        css_content = """
        @page {
            size: A4;
            margin: 2cm;
        }

        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #333;
        }

        h1 {
            color: #2c5530;
            font-size: 24pt;
            margin-bottom: 0.5em;
        }

        h2 {
            color: #3a7045;
            font-size: 18pt;
            margin-top: 1em;
            margin-bottom: 0.5em;
        }

        h3 {
            color: #4a8a55;
            font-size: 14pt;
        }

        .container {
            max-width: 100%;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1em 0;
        }

        th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
        }

        th {
            background-color: #3a7045;
            color: white;
        }
        """

        return CSS(string=css_content)

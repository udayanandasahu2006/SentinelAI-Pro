from fastapi import APIRouter
from fastapi.responses import FileResponse

from app.utils.pdf_generator import generate_pdf


router = APIRouter(
    prefix="/report",
    tags=["PDF Report"]
)



@router.get("/generate")
def create_report():


    data={

        "System":"SentinelAI Pro",

        "Model":"YOLOv8",

        "Status":"Operational",

        "Report Type":"AI Threat Detection"

    }


    file=generate_pdf(
        data,
        "sentinel_report"
    )


    return FileResponse(
        file,
        media_type="application/pdf",
        filename="sentinel_report.pdf"
    )
from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from datetime import datetime

from app.database.database import get_db
from app.database.models import Prediction
from app.utils.pdf_generator import generate_pdf


router = APIRouter(
    prefix="/report",
    tags=["PDF Report"]
)


@router.get("/generate")
def create_report(db: Session = Depends(get_db)):

    # --------------------------------------------------
    # GET ALL PREDICTIONS FROM DATABASE
    # --------------------------------------------------

    predictions = (
        db.query(Prediction)
        .order_by(Prediction.id.desc())
        .all()
    )

    # --------------------------------------------------
    # TOTAL DETECTIONS
    # --------------------------------------------------

    total_detections = len(predictions)

    # --------------------------------------------------
    # THREAT DETECTIONS
    # --------------------------------------------------

    threat_count = 0

    for item in predictions:

        prediction = str(
            getattr(item, "prediction", "")
        ).lower()

        # Objects considered threats
        threat_objects = [
            "weapon",
            "gun",
            "pistol",
            "rifle",
            "knife",
            "firearm",
            "explosive",
            "bomb",
            "threat"
        ]

        if any(
            threat in prediction
            for threat in threat_objects
        ):
            threat_count += 1

    # --------------------------------------------------
    # AUTHORIZED PERSON COUNT
    # --------------------------------------------------

    authorized_count = 0
    unauthorized_count = 0
    not_verified_count = 0

    for item in predictions:

        prediction = str(
            getattr(item, "prediction", "")
        ).lower()

        # If your database later gets an "authorized"
        # field, this will automatically use it.

        authorization = getattr(
            item,
            "authorized",
            None
        )

        if authorization is True:

            authorized_count += 1

        elif authorization is False:

            unauthorized_count += 1

        elif prediction == "authorized person":

            authorized_count += 1

        elif prediction == "unauthorized person":

            unauthorized_count += 1

        else:

            # YOLO person detection alone cannot
            # determine identity/authorization.
            not_verified_count += 1

    # --------------------------------------------------
    # REPORT DATA
    # --------------------------------------------------

    report_data = {

        "system": "SentinelAI Pro",

        "model": "YOLOv8",

        "status": "Operational",

        "report_type": "AI Threat Detection",

        "generated_at": datetime.now(),

        "total_detections": total_detections,

        "threat_count": threat_count,

        "authorized_count": authorized_count,

        "unauthorized_count": unauthorized_count,

        "not_verified_count": not_verified_count,

        "detections": predictions
    }

    # --------------------------------------------------
    # GENERATE PDF
    # --------------------------------------------------

    file_path = generate_pdf(
        report_data,
        "sentinel_report"
    )

    # --------------------------------------------------
    # RETURN PDF
    # --------------------------------------------------

    return FileResponse(

        path=file_path,

        media_type="application/pdf",

        filename="sentinel_report.pdf",

        headers={
            "Content-Disposition":
                "attachment; filename=sentinel_report.pdf"
        }
    )
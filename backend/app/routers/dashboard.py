from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.database import get_db
from app.database.models import Prediction

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


# Objects that SentinelAI Pro considers threats
THREAT_OBJECTS = {
    "gun",
    "pistol",
    "rifle",
    "weapon",
    "knife",
    "firearm",
    "explosive",
    "bomb",
    "tank",
    "soldier"
}


@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):

    # -----------------------------------------
    # Total detections
    # -----------------------------------------

    total = db.query(Prediction).count()

    # -----------------------------------------
    # Get all predictions
    # -----------------------------------------

    predictions = (
        db.query(Prediction.prediction)
        .all()
    )

    # -----------------------------------------
    # Count threats
    # -----------------------------------------

    threats = 0

    for item in predictions:

        prediction = str(
            item[0] or ""
        ).strip().lower()

        if prediction in THREAT_OBJECTS:
            threats += 1

    # -----------------------------------------
    # Safe detections
    # -----------------------------------------

    safe = max(
        total - threats,
        0
    )

    # -----------------------------------------
    # Average confidence
    # -----------------------------------------

    avg = db.query(
        func.avg(Prediction.confidence)
    ).scalar()

    if avg is None:
        avg = 0.0

    # -----------------------------------------
    # Response
    # -----------------------------------------

    return {

        "total_predictions": total,

        "threats_detected": threats,

        "safe_images": safe,

        "average_confidence": float(avg)

    }
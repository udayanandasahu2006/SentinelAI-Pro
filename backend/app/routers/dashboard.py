from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.database import get_db
from app.database.models import Prediction

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):

    total = db.query(Prediction).count()

    threats = db.query(Prediction).filter(
        Prediction.prediction != "No Threat Detected"
    ).count()

    safe = total - threats

    avg = db.query(
        func.avg(Prediction.confidence)
    ).scalar()

    if avg is None:
        avg = 0

    return {
        "total_predictions": total,
        "threats_detected": threats,
        "safe_images": safe,
        "average_confidence": float(avg)
    }
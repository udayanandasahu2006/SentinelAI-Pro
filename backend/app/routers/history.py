from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Prediction

router = APIRouter(
    prefix="/history",
    tags=["Prediction History"]
)


@router.get("/")
def get_history(db: Session = Depends(get_db)):
    predictions = (
        db.query(Prediction)
        .order_by(Prediction.created_at.desc())
        .all()
    )

    return predictions
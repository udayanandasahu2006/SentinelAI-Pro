from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
import os
import shutil

from app.ai.services.prediction_service import predict
from app.database.database import get_db
from app.database.models import Prediction

router = APIRouter(
    prefix="/prediction",
    tags=["AI Prediction"]
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@router.post("/predict")
async def predict_image(file: UploadFile = File(...), db: Session = Depends(get_db)):
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = predict(file_path)

    new_prediction = Prediction(
        filename=file.filename,
        prediction=result["prediction"],
        confidence=result["confidence"]
    )

    db.add(new_prediction)
    db.commit()
    db.refresh(new_prediction)

    return {
        "id": new_prediction.id,
        "filename": file.filename,
        "prediction": result["prediction"],
        "confidence": result["confidence"]
    }
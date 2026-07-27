from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
import shutil
import os

from app.ai.services.video_service import process_video

router = APIRouter(
    prefix="/video",
    tags=["Video Detection"]
)

UPLOAD_FOLDER = "uploads/videos"
OUTPUT_FOLDER = "outputs"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(OUTPUT_FOLDER, exist_ok=True)


@router.post("/predict")
async def predict_video(file: UploadFile = File(...)):

    video_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(video_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = process_video(video_path)

    filename = os.path.basename(result["output_video"])

    return {
        "success": True,
        "filename": filename,
        "video_url": f"http://127.0.0.1:8000/video/output/{filename}",
        "total_detections": result["total_detections"],
        "detections": result["detections"]
    }


@router.get("/output/{filename}")
def get_output_video(filename: str):

    path = os.path.join(OUTPUT_FOLDER, filename)

    if not os.path.exists(path):
        return {"error": "Video not found"}

    return FileResponse(
        path,
        media_type="video/mp4",
        filename=filename
    )
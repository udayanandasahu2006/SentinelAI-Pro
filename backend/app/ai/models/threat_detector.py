from ultralytics import YOLO
import os

# Path to the YOLO model
MODEL_PATH = "app/ai/models/yolov8n.pt"

# Load the model only if it exists
model = YOLO(MODEL_PATH) if os.path.exists(MODEL_PATH) else None


def predict_image(image_path: str):
    if model is None:
        return "Model not found", 0.0

    results = model(image_path)

    if len(results) == 0 or len(results[0].boxes) == 0:
        return "No Threat Detected", 0.0

    box = results[0].boxes[0]
    class_id = int(box.cls[0])
    confidence = float(box.conf[0])

    prediction = model.names[class_id]

    return prediction, round(confidence, 2)
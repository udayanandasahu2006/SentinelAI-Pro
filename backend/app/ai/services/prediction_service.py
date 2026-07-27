import os
from ultralytics import YOLO

# Load model only once
MODEL_PATH = "app/ai/models/best.pt"

if os.path.exists(MODEL_PATH):
    model = YOLO(MODEL_PATH)
else:
    model = YOLO("yolov8n.pt")


def predict(image_path):

    results = model(image_path)

    result = results[0]

    if len(result.boxes) == 0:

        return {
            "prediction": "No Threat Detected",
            "confidence": 0.0,
            "detections": []
        }

    best_box = result.boxes[0]

    class_id = int(best_box.cls[0])
    confidence = float(best_box.conf[0])

    class_name = model.names[class_id]

    detections = []

    for box in result.boxes:

        cls = int(box.cls[0])

        detections.append({

            "class": model.names[cls],
            "confidence": round(float(box.conf[0]), 4),
            "bbox": [
                float(box.xyxy[0][0]),
                float(box.xyxy[0][1]),
                float(box.xyxy[0][2]),
                float(box.xyxy[0][3])
            ]

        })

    return {

        "prediction": class_name,
        "confidence": round(confidence, 4),
        "detections": detections

    }
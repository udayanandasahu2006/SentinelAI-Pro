from fastapi import APIRouter
import cv2
import threading

router = APIRouter(
    prefix="/webcam",
    tags=["Webcam"]
)

camera = None
running = False


def camera_task():
    global camera, running

    camera = cv2.VideoCapture(0, cv2.CAP_DSHOW)

    while running:

        ret, frame = camera.read()

        if not ret:
            break

        cv2.imshow("SentinelAI Webcam", frame)

        if cv2.waitKey(1) & 0xFF == ord("q"):
            running = False
            break

    camera.release()
    camera = None
    cv2.destroyAllWindows()


@router.get("/start")
def start():

    global running

    if running:
        return {"message": "Camera already running"}

    running = True

    thread = threading.Thread(
        target=camera_task,
        daemon=True
    )

    thread.start()

    return {
        "message": "Camera started"
    }


@router.get("/stop")
def stop():

    global running

    running = False

    cv2.destroyAllWindows()

    return {
        "message": "Camera stopped"
    }
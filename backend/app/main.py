from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Routers
from app.routers.auth import router as auth_router
from app.routers.user import router as user_router
from app.routers.prediction import router as prediction_router
from app.routers.history import router as history_router
from app.routers.dashboard import router as dashboard_router
from app.routers.video import router as video_router
from app.routers.webcam import router as webcam_router
from app.routers.report import router as report_router
from app.database.database import engine
from app.database.models import Base

app = FastAPI(
    title="SentinelAI-Pro API",
    version="1.0.0"
)

# ---------------- CORS ----------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://sentinel-ai-pro-ten.vercel.app/",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- Home ----------------

@app.get("/")
def home():
    return {
        "message": "SentinelAI-Pro Backend Running Successfully"
    }

# ---------------- Routers ----------------

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(prediction_router)
app.include_router(history_router)
app.include_router(dashboard_router)
app.include_router(video_router)
app.include_router(webcam_router)
app.include_router(report_router)
# Create database tables
Base.metadata.create_all(bind=engine)
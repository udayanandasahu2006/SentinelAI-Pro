from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_user

router = APIRouter(
    prefix="/user",
    tags=["User"]
)

@router.get("/profile")
def profile(current_user: str = Depends(get_current_user)):
    return {
        "message": "Welcome to SentinelAI Pro",
        "email": current_user
    }
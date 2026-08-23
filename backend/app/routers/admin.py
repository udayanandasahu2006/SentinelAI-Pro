from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from passlib.context import CryptContext

from app.database.database import get_db
from app.database.models import User
from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# =========================================================
# CREATE USER REQUEST
# =========================================================

class CreateUserRequest(BaseModel):

    username: str
    email: str
    password: str

    can_dashboard: bool = True
    can_image_detection: bool = True
    can_webcam_detection: bool = True
    can_video_detection: bool = True
    can_authorized_persons: bool = False
    can_history: bool = True


# =========================================================
# CREATE USER
# =========================================================

@router.post("/users")
def create_user(
    data: CreateUserRequest,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    # Find logged-in user
    admin = (
        db.query(User)
        .filter(User.email == current_user)
        .first()
    )

    if not admin:
        raise HTTPException(
            status_code=404,
            detail="Admin user not found"
        )

    # Only admin can create users
    if admin.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    # Check email
    existing = (
        db.query(User)
        .filter(User.email == data.email)
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Create user
    user = User(
        username=data.username,
        email=data.email,
        password=pwd_context.hash(data.password),

        role="user",
        is_active=True,

        can_dashboard=data.can_dashboard,
        can_image_detection=data.can_image_detection,
        can_webcam_detection=data.can_webcam_detection,
        can_video_detection=data.can_video_detection,
        can_authorized_persons=data.can_authorized_persons,
        can_history=data.can_history
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "message": "User created successfully",
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role
    }


# =========================================================
# GET ALL USERS
# =========================================================

@router.get("/users")
def get_users(
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):

    admin = (
        db.query(User)
        .filter(User.email == current_user)
        .first()
    )

    if not admin:
        raise HTTPException(
            status_code=404,
            detail="Admin user not found"
        )

    if admin.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    users = (
        db.query(User)
        .order_by(User.id.desc())
        .all()
    )

    return [
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,

            "can_dashboard": user.can_dashboard,
            "can_image_detection": user.can_image_detection,
            "can_webcam_detection": user.can_webcam_detection,
            "can_video_detection": user.can_video_detection,
            "can_authorized_persons": user.can_authorized_persons,
            "can_history": user.can_history
        }
        for user in users
    ]
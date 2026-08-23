from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from sqlalchemy import text
from passlib.context import CryptContext

from app.database.database import get_db
from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/user",
    tags=["User"]
)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# =========================================================
# REQUEST MODEL - ADMIN CREATES USER
# =========================================================

class CreateUserRequest(BaseModel):

    username: str
    email: EmailStr
    password: str

    role: str = "user"

    can_dashboard: bool = True
    can_image_detection: bool = True
    can_webcam_detection: bool = True
    can_video_detection: bool = True
    can_authorized_persons: bool = False
    can_history: bool = True

    camera_ids: list[int] = []


# =========================================================
# CHECK ADMIN
# =========================================================

def check_admin(
    current_user: str,
    db: Session
):

    result = db.execute(
        text("""
            SELECT role
            FROM users
            WHERE email = :email
        """),
        {
            "email": current_user
        }
    ).fetchone()

    if not result:

        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    if result[0] != "admin":

        raise HTTPException(
            status_code=403,
            detail="Admin permission required"
        )

    return True


# =========================================================
# USER PROFILE
# =========================================================

@router.get("/profile")
def profile(
    current_user: str = Depends(get_current_user)
):

    return {

        "message": "Welcome to SentinelAI Pro",

        "email": current_user

    }


# =========================================================
# ADMIN - CREATE USER
# =========================================================

@router.post("/admin/create-user")
def create_user(

    data: CreateUserRequest,

    current_user: str = Depends(get_current_user),

    db: Session = Depends(get_db)

):

    # Check admin
    check_admin(
        current_user,
        db
    )

    # Only allow admin/user roles
    if data.role not in ["admin", "user"]:

        raise HTTPException(
            status_code=400,
            detail="Role must be admin or user"
        )

    # Check email
    existing_email = db.execute(
        text("""
            SELECT id
            FROM users
            WHERE email = :email
        """),
        {
            "email": data.email
        }
    ).fetchone()

    if existing_email:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # Check username
    existing_username = db.execute(
        text("""
            SELECT id
            FROM users
            WHERE username = :username
        """),
        {
            "username": data.username
        }
    ).fetchone()

    if existing_username:

        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )

    # Hash password
    hashed_password = pwd_context.hash(
        data.password
    )

    # Create user
    result = db.execute(

        text("""
            INSERT INTO users (
                username,
                email,
                password,
                role,
                is_active,
                can_dashboard,
                can_image_detection,
                can_webcam_detection,
                can_video_detection,
                can_authorized_persons,
                can_history
            )
            VALUES (
                :username,
                :email,
                :password,
                :role,
                TRUE,
                :can_dashboard,
                :can_image_detection,
                :can_webcam_detection,
                :can_video_detection,
                :can_authorized_persons,
                :can_history
            )
            RETURNING id
        """),

        {
            "username": data.username,
            "email": data.email,
            "password": hashed_password,
            "role": data.role,

            "can_dashboard":
                data.can_dashboard,

            "can_image_detection":
                data.can_image_detection,

            "can_webcam_detection":
                data.can_webcam_detection,

            "can_video_detection":
                data.can_video_detection,

            "can_authorized_persons":
                data.can_authorized_persons,

            "can_history":
                data.can_history
        }

    )

    user_id = result.fetchone()[0]

    # =====================================================
    # ASSIGN MULTIPLE CAMERAS
    # =====================================================

    for camera_id in data.camera_ids:

        camera_exists = db.execute(

            text("""
                SELECT id
                FROM cameras
                WHERE id = :camera_id
            """),

            {
                "camera_id": camera_id
            }

        ).fetchone()

        if not camera_exists:

            raise HTTPException(
                status_code=404,
                detail=f"Camera {camera_id} not found"
            )

        db.execute(

            text("""
                INSERT INTO user_cameras (
                    user_id,
                    camera_id
                )
                VALUES (
                    :user_id,
                    :camera_id
                )
                ON CONFLICT DO NOTHING
            """),

            {
                "user_id": user_id,
                "camera_id": camera_id
            }

        )

    db.commit()

    return {

        "message":
            "User created successfully",

        "user_id":
            user_id,

        "username":
            data.username,

        "email":
            data.email,

        "role":
            data.role,

        "camera_ids":
            data.camera_ids,

        "permissions": {

            "dashboard":
                data.can_dashboard,

            "image_detection":
                data.can_image_detection,

            "webcam_detection":
                data.can_webcam_detection,

            "video_detection":
                data.can_video_detection,

            "authorized_persons":
                data.can_authorized_persons,

            "history":
                data.can_history
        }

    }
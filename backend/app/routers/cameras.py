from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import cv2

from app.database.database import get_db
from app.database.models import Camera, User

from app.core.dependencies import get_current_user


router = APIRouter(
    prefix="/cameras",
    tags=["CCTV Cameras"]
)


# =========================================================
# REQUEST MODEL
# =========================================================

class CameraCreate(BaseModel):

    name: str

    url: str

    username: str | None = None

    password: str | None = None


# =========================================================
# ADMIN CHECK
# =========================================================

def get_admin(
    current_user: str,
    db: Session
):

    user = (
        db.query(User)
        .filter(User.email == current_user)
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    if user.role != "admin":

        raise HTTPException(
            status_code=403,
            detail="Admin permission required"
        )

    return user


# =========================================================
# ADD CAMERA
# ADMIN ONLY
# =========================================================

@router.post("/")
def add_camera(

    data: CameraCreate,

    current_user: str = Depends(get_current_user),

    db: Session = Depends(get_db)

):

    # Check admin
    get_admin(
        current_user,
        db
    )

    camera = Camera(

        name=data.name,

        url=data.url,

        username=data.username,

        password=data.password,

        active=True

    )

    db.add(camera)

    db.commit()

    db.refresh(camera)

    return {

        "message":
            "Camera added successfully",

        "id":
            camera.id,

        "name":
            camera.name,

        "url":
            camera.url,

        "active":
            camera.active

    }


# =========================================================
# GET CAMERAS
#
# ADMIN  → ALL CAMERAS
# USER   → ONLY ASSIGNED CAMERAS
# =========================================================

@router.get("/")
def get_cameras(

    current_user: str = Depends(get_current_user),

    db: Session = Depends(get_db)

):

    user = (
        db.query(User)
        .filter(
            User.email == current_user
        )
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=401,
            detail="User not found"
        )


    # =====================================================
    # ADMIN
    # =====================================================

    if user.role == "admin":

        cameras = (
            db.query(Camera)
            .order_by(
                Camera.id.desc()
            )
            .all()
        )

    # =====================================================
    # NORMAL USER
    # =====================================================

    else:

        cameras = (
            db.query(Camera)
            .join(
                Camera.users
            )
            .filter(
                User.id == user.id
            )
            .order_by(
                Camera.id.desc()
            )
            .all()
        )


    return [

        {
            "id":
                camera.id,

            "name":
                camera.name,

            "url":
                camera.url,

            "username":
                camera.username,

            "active":
                camera.active

        }

        for camera in cameras

    ]


# =========================================================
# ASSIGN CAMERA TO USER
# ADMIN ONLY
# =========================================================

class CameraAssignment(BaseModel):

    user_id: int

    camera_id: int


@router.post("/assign")
def assign_camera(

    data: CameraAssignment,

    current_user: str = Depends(get_current_user),

    db: Session = Depends(get_db)

):

    # Check admin
    get_admin(
        current_user,
        db
    )


    user = (
        db.query(User)
        .filter(
            User.id == data.user_id
        )
        .first()
    )

    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    camera = (
        db.query(Camera)
        .filter(
            Camera.id == data.camera_id
        )
        .first()
    )

    if not camera:

        raise HTTPException(
            status_code=404,
            detail="Camera not found"
        )


    # Check if already assigned
    existing = db.execute(
        """
        SELECT 1
        FROM user_cameras
        WHERE user_id = :user_id
        AND camera_id = :camera_id
        """,
        {
            "user_id": data.user_id,
            "camera_id": data.camera_id
        }
    ).fetchone()


    if existing:

        raise HTTPException(
            status_code=400,
            detail="Camera already assigned to this user"
        )


    db.execute(
        """
        INSERT INTO user_cameras
        (user_id, camera_id)
        VALUES
        (:user_id, :camera_id)
        """,
        {
            "user_id": data.user_id,
            "camera_id": data.camera_id
        }
    )


    db.commit()


    return {

        "message":
            "Camera assigned successfully",

        "user_id":
            data.user_id,

        "camera_id":
            data.camera_id

    }


# =========================================================
# REMOVE CAMERA FROM USER
# ADMIN ONLY
# =========================================================

@router.delete("/assign/{user_id}/{camera_id}")
def remove_camera_assignment(

    user_id: int,

    camera_id: int,

    current_user: str = Depends(get_current_user),

    db: Session = Depends(get_db)

):

    # Check admin
    get_admin(
        current_user,
        db
    )


    result = db.execute(
        """
        DELETE FROM user_cameras
        WHERE user_id = :user_id
        AND camera_id = :camera_id
        """,
        {
            "user_id": user_id,
            "camera_id": camera_id
        }
    )


    if result.rowcount == 0:

        raise HTTPException(
            status_code=404,
            detail="Camera assignment not found"
        )


    db.commit()


    return {

        "message":
            "Camera removed from user"

    }


# =========================================================
# DELETE CAMERA
# ADMIN ONLY
# =========================================================

@router.delete("/{camera_id}")
def delete_camera(

    camera_id: int,

    current_user: str = Depends(get_current_user),

    db: Session = Depends(get_db)

):

    # Check admin
    get_admin(
        current_user,
        db
    )


    camera = (
        db.query(Camera)
        .filter(
            Camera.id == camera_id
        )
        .first()
    )


    if not camera:

        raise HTTPException(
            status_code=404,
            detail="Camera not found"
        )


    db.delete(camera)

    db.commit()


    return {

        "message":
            "Camera deleted"

    }


# =========================================================
# TEST CAMERA
# =========================================================

@router.get("/{camera_id}/test")
def test_camera(

    camera_id: int,

    current_user: str = Depends(get_current_user),

    db: Session = Depends(get_db)

):

    user = (
        db.query(User)
        .filter(
            User.email == current_user
        )
        .first()
    )


    if not user:

        raise HTTPException(
            status_code=401,
            detail="User not found"
        )


    camera = (
        db.query(Camera)
        .filter(
            Camera.id == camera_id
        )
        .first()
    )


    if not camera:

        raise HTTPException(
            status_code=404,
            detail="Camera not found"
        )


    # =====================================================
    # NORMAL USER → CHECK ASSIGNMENT
    # =====================================================

    if user.role != "admin":

        assigned = db.execute(

            """
            SELECT 1
            FROM user_cameras
            WHERE user_id = :user_id
            AND camera_id = :camera_id
            """,

            {
                "user_id": user.id,
                "camera_id": camera_id
            }

        ).fetchone()


        if not assigned:

            raise HTTPException(
                status_code=403,
                detail="You do not have access to this camera"
            )


    # =====================================================
    # TEST CAMERA CONNECTION
    # =====================================================

    capture = cv2.VideoCapture(
        camera.url
    )

    connected = capture.isOpened()

    capture.release()


    return {

        "camera_id":
            camera.id,

        "camera":
            camera.name,

        "online":
            connected

    }
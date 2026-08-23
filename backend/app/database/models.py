from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
    Boolean,
    ForeignKey,
    Table
)

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


# =========================================================
# USER ↔ CAMERA ASSOCIATION TABLE
# =========================================================

user_cameras = Table(
    "user_cameras",
    Base.metadata,

    Column(
        "user_id",
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE"
        ),
        primary_key=True
    ),

    Column(
        "camera_id",
        Integer,
        ForeignKey(
            "cameras.id",
            ondelete="CASCADE"
        ),
        primary_key=True
    )
)


# =========================================================
# USER
# =========================================================

class User(Base):

    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    username = Column(
        String(100),
        unique=True,
        nullable=False
    )

    email = Column(
        String(100),
        unique=True,
        nullable=False
    )

    password = Column(
        String(255),
        nullable=False
    )

    # =====================================================
    # ROLE
    # =====================================================

    role = Column(
        String(20),
        default="user",
        nullable=False
    )

    # admin / user


    # =====================================================
    # ACCOUNT STATUS
    # =====================================================

    is_active = Column(
        Boolean,
        default=True,
        nullable=False
    )


    # =====================================================
    # PERMISSIONS
    # =====================================================

    can_dashboard = Column(
        Boolean,
        default=True,
        nullable=False
    )

    can_image_detection = Column(
        Boolean,
        default=True,
        nullable=False
    )

    can_webcam_detection = Column(
        Boolean,
        default=True,
        nullable=False
    )

    can_video_detection = Column(
        Boolean,
        default=True,
        nullable=False
    )

    can_authorized_persons = Column(
        Boolean,
        default=False,
        nullable=False
    )

    can_history = Column(
        Boolean,
        default=True,
        nullable=False
    )


    # =====================================================
    # USER ↔ CAMERA
    # =====================================================

    cameras = relationship(
        "Camera",
        secondary=user_cameras,
        back_populates="users"
    )


# =========================================================
# AUTHORIZED PERSON
# =========================================================

class AuthorizedPerson(Base):

    __tablename__ = "authorized_persons"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100),
        nullable=False
    )

    person_id = Column(
        String(100),
        unique=True,
        nullable=False
    )

    authorized = Column(
        Boolean,
        default=True,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )


# =========================================================
# CCTV CAMERA
# =========================================================

class Camera(Base):

    __tablename__ = "cameras"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100),
        nullable=False
    )

    url = Column(
        String(500),
        nullable=False
    )

    username = Column(
        String(100),
        nullable=True
    )

    password = Column(
        String(255),
        nullable=True
    )

    active = Column(
        Boolean,
        default=True,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )


    # =====================================================
    # CAMERA ↔ USER
    # =====================================================

    users = relationship(
        "User",
        secondary=user_cameras,
        back_populates="cameras"
    )


# =========================================================
# PREDICTION
# =========================================================

class Prediction(Base):

    __tablename__ = "predictions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    filename = Column(
        String(255),
        nullable=False
    )

    prediction = Column(
        String(100),
        nullable=False
    )

    confidence = Column(
        Float,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=True
    )

    camera_id = Column(
        Integer,
        ForeignKey("cameras.id"),
        nullable=True
    )

    authorized = Column(
        Boolean,
        nullable=True
    )

    siren = Column(
        Boolean,
        default=False,
        nullable=False
    )

    source = Column(
        String(50),
        default="image",
        nullable=False
    )
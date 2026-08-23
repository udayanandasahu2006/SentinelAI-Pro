from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import User

from passlib.context import CryptContext
from jose import jwt, JWTError

from datetime import datetime, timedelta

from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# =========================================================
# JWT SETTINGS
# =========================================================

SECRET_KEY = "sentinelai_secret_key"
ALGORITHM = "HS256"


# =========================================================
# PASSWORD HASHING
# =========================================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# =========================================================
# AUTHENTICATION
# =========================================================

security = HTTPBearer()


# =========================================================
# CREATE TOKEN
# =========================================================

def create_token(data):

    payload = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=30
    )

    payload["exp"] = expire

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


# =========================================================
# GET CURRENT USER
# =========================================================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):

    token = credentials.credentials

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        email = payload.get("sub")

        if not email:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )


    user = db.query(User).filter(
        User.email == email
    ).first()


    if not user:

        raise HTTPException(
            status_code=401,
            detail="User not found"
        )


    if not user.is_active:

        raise HTTPException(
            status_code=403,
            detail="Your account has been disabled"
        )


    return user


# =========================================================
# ADMIN CHECK
# =========================================================

def get_current_admin(
    current_user: User = Depends(get_current_user)
):

    if current_user.role != "admin":

        raise HTTPException(
            status_code=403,
            detail="Admin permission required"
        )

    return current_user


# =========================================================
# REGISTER USER
# =========================================================
# IMPORTANT:
# Only ADMIN can create accounts now.
# =========================================================

@router.post("/register")
def register(

    username: str,

    email: str,

    password: str,

    db: Session = Depends(get_db),

    admin: User = Depends(get_current_admin)

):

    existing = db.query(User).filter(
        User.email == email
    ).first()


    if existing:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )


    existing_username = db.query(User).filter(
        User.username == username
    ).first()


    if existing_username:

        raise HTTPException(
            status_code=400,
            detail="Username already exists"
        )


    hashed = pwd_context.hash(password)


    user = User(

        username=username,

        email=email,

        password=hashed,

        role="user",

        is_active=True

    )


    db.add(user)

    db.commit()

    db.refresh(user)


    return {

        "message": "User created successfully",

        "username": user.username,

        "email": user.email,

        "role": user.role,

        "is_active": user.is_active

    }


# =========================================================
# LOGIN
# =========================================================

@router.post("/login")
def login(

    email: str,

    password: str,

    db: Session = Depends(get_db)

):

    user = db.query(User).filter(
        User.email == email
    ).first()


    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )


    if not pwd_context.verify(
        password,
        user.password
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )


    # Check whether admin disabled this account

    if not user.is_active:

        raise HTTPException(
            status_code=403,
            detail="Your account has been disabled by administrator"
        )


    # Include role inside token

    token = create_token({

        "sub": user.email,

        "user_id": user.id,

        "role": user.role

    })


    return {

        "access_token": token,

        "token_type": "bearer",

        "user": {

            "id": user.id,

            "username": user.username,

            "email": user.email,

            "role": user.role

        }

    }


# =========================================================
# CURRENT USER
# =========================================================

@router.get("/me")
def get_me(

    current_user: User = Depends(
        get_current_user
    )

):

    return {

        "id": current_user.id,

        "username": current_user.username,

        "email": current_user.email,

        "role": current_user.role,

        "is_active": current_user.is_active

    }


# =========================================================
# ADMIN - LIST USERS
# =========================================================

@router.get("/users")
def get_users(

    db: Session = Depends(get_db),

    admin: User = Depends(get_current_admin)

):

    users = db.query(User).all()


    return [

        {

            "id": user.id,

            "username": user.username,

            "email": user.email,

            "role": user.role,

            "is_active": user.is_active

        }

        for user in users

    ]


# =========================================================
# ADMIN - ACTIVATE USER
# =========================================================

@router.put("/users/{user_id}/activate")
def activate_user(

    user_id: int,

    db: Session = Depends(get_db),

    admin: User = Depends(get_current_admin)

):

    user = db.query(User).filter(
        User.id == user_id
    ).first()


    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    user.is_active = True

    db.commit()


    return {

        "message": "User activated successfully"

    }


# =========================================================
# ADMIN - DEACTIVATE USER
# =========================================================

@router.put("/users/{user_id}/deactivate")
def deactivate_user(

    user_id: int,

    db: Session = Depends(get_db),

    admin: User = Depends(get_current_admin)

):

    user = db.query(User).filter(
        User.id == user_id
    ).first()


    if not user:

        raise HTTPException(
            status_code=404,
            detail="User not found"
        )


    # Prevent admin from disabling himself

    if user.id == admin.id:

        raise HTTPException(
            status_code=400,
            detail="Admin cannot disable their own account"
        )


    user.is_active = False

    db.commit()


    return {

        "message": "User deactivated successfully"

    }
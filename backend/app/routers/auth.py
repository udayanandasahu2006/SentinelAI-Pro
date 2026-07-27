from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import User

from passlib.context import CryptContext
from jose import jwt

from datetime import datetime, timedelta


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


SECRET_KEY = "sentinelai_secret_key"
ALGORITHM = "HS256"


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)



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



@router.post("/register")
def register(
    username:str,
    email:str,
    password:str,
    db:Session=Depends(get_db)
):


    existing=db.query(User).filter(
        User.email==email
    ).first()


    if existing:

        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )



    hashed=password_hash = pwd_context.hash(password)


    user=User(

        username=username,

        email=email,

        password=hashed

    )


    db.add(user)

    db.commit()

    db.refresh(user)



    return {

        "message":"User created successfully"

    }





@router.post("/login")
def login(

    email:str,

    password:str,

    db:Session=Depends(get_db)

):


    user=db.query(User).filter(
        User.email==email
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



    token=create_token({

        "sub":user.email

    })


    return {


        "access_token":token,

        "token_type":"bearer"

    }
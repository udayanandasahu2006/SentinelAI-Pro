from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.database.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255))
    prediction = Column(String(100))
    confidence = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)
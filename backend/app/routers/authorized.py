from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database.database import get_db
from app.database.models import AuthorizedPerson


router = APIRouter(
    prefix="/authorized",
    tags=["Authorized Persons"]
)


# =========================================================
# REQUEST MODEL
# =========================================================

class AuthorizedPersonCreate(BaseModel):

    name: str
    person_id: str
    authorized: bool = True


# =========================================================
# ADD PERSON
# =========================================================

@router.post("/")
def add_authorized_person(
    data: AuthorizedPersonCreate,
    db: Session = Depends(get_db)
):

    existing = (
        db.query(AuthorizedPerson)
        .filter(
            AuthorizedPerson.person_id == data.person_id
        )
        .first()
    )

    if existing:

        raise HTTPException(
            status_code=400,
            detail="Person ID already exists"
        )

    person = AuthorizedPerson(
        name=data.name,
        person_id=data.person_id,
        authorized=data.authorized
    )

    db.add(person)
    db.commit()
    db.refresh(person)

    return {
        "id": person.id,
        "name": person.name,
        "person_id": person.person_id,
        "authorized": person.authorized,
        "created_at": person.created_at
    }


# =========================================================
# GET ALL PEOPLE
# =========================================================

@router.get("/")
def get_authorized_people(
    db: Session = Depends(get_db)
):

    people = (
        db.query(AuthorizedPerson)
        .order_by(
            AuthorizedPerson.id.desc()
        )
        .all()
    )

    return [
        {
            "id": person.id,
            "name": person.name,
            "person_id": person.person_id,
            "authorized": person.authorized,
            "created_at": person.created_at
        }
        for person in people
    ]


# =========================================================
# UPDATE AUTHORIZATION
# =========================================================

@router.put("/{person_id}")
def update_authorization(
    person_id: int,
    authorized: bool,
    db: Session = Depends(get_db)
):

    person = (
        db.query(AuthorizedPerson)
        .filter(
            AuthorizedPerson.id == person_id
        )
        .first()
    )

    if not person:

        raise HTTPException(
            status_code=404,
            detail="Person not found"
        )

    person.authorized = authorized

    db.commit()
    db.refresh(person)

    return {
        "message": "Authorization updated",
        "id": person.id,
        "authorized": person.authorized
    }


# =========================================================
# DELETE PERSON
# =========================================================

@router.delete("/{person_id}")
def delete_authorized_person(
    person_id: int,
    db: Session = Depends(get_db)
):

    person = (
        db.query(AuthorizedPerson)
        .filter(
            AuthorizedPerson.id == person_id
        )
        .first()
    )

    if not person:

        raise HTTPException(
            status_code=404,
            detail="Person not found"
        )

    db.delete(person)
    db.commit()

    return {
        "message": "Authorized person deleted"
    }
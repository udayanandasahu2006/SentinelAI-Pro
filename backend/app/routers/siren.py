from fastapi import APIRouter

from app.services.siren_service import siren_manager


router = APIRouter(
    prefix="/siren",
    tags=["Siren"]
)


@router.get("/status")
def get_siren_status():

    return siren_manager.status()


@router.post("/on")
def turn_siren_on():

    siren_manager.trigger(
        reason="Manual activation"
    )

    return siren_manager.status()


@router.post("/off")
def turn_siren_off():

    siren_manager.stop()

    return siren_manager.status()
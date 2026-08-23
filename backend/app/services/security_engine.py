from app.services.siren_service import siren_manager


THREAT_OBJECTS = {
    "weapon",
    "gun",
    "pistol",
    "rifle",
    "knife",
    "firearm",
    "bomb",
    "explosive"
}


def evaluate_detection(
    prediction: str,
    confidence: float,
    authorized: bool | None = None,
    camera_id=None
):

    label = str(
        prediction
    ).strip().lower()


    # =====================================================
    # THREAT OBJECT
    # =====================================================

    is_threat = any(
        threat in label
        for threat in THREAT_OBJECTS
    )


    if is_threat:

        siren_manager.trigger(
            reason=f"Threat detected: {prediction}",
            camera_id=camera_id
        )

        return {
            "prediction": prediction,
            "confidence": confidence,
            "authorized": False,
            "threat": True,
            "siren": True,
            "status": "THREAT"
        }


    # =====================================================
    # PERSON
    # =====================================================

    if label == "person":

        # Explicitly authorized
        if authorized is True:

            return {
                "prediction": prediction,
                "confidence": confidence,
                "authorized": True,
                "threat": False,
                "siren": False,
                "status": "AUTHORIZED PERSON"
            }


        # Explicitly unauthorized
        if authorized is False:

            siren_manager.trigger(
                reason="Unauthorized person",
                camera_id=camera_id
            )

            return {
                "prediction": prediction,
                "confidence": confidence,
                "authorized": False,
                "threat": True,
                "siren": True,
                "status": "UNAUTHORIZED PERSON"
            }


        # Unknown person
        return {
            "prediction": prediction,
            "confidence": confidence,
            "authorized": None,
            "threat": False,
            "siren": False,
            "status": "PERSON - NOT VERIFIED"
        }


    # =====================================================
    # NORMAL OBJECT
    # =====================================================

    return {
        "prediction": prediction,
        "confidence": confidence,
        "authorized": None,
        "threat": False,
        "siren": False,
        "status": "NORMAL"
    }
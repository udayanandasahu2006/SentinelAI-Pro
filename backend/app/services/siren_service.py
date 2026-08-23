import threading
import time


class SirenManager:

    def __init__(self):

        self.active = False

        self.reason = None

        self.camera_id = None

        self.last_triggered = None

        self.lock = threading.Lock()


    # =====================================================
    # TURN SIREN ON
    # =====================================================

    def trigger(
        self,
        reason="Threat detected",
        camera_id=None
    ):

        with self.lock:

            self.active = True

            self.reason = reason

            self.camera_id = camera_id

            self.last_triggered = time.time()

            print(
                f"[SIREN ON] "
                f"reason={reason} "
                f"camera={camera_id}"
            )


    # =====================================================
    # TURN SIREN OFF
    # =====================================================

    def stop(self):

        with self.lock:

            self.active = False

            self.reason = None

            self.camera_id = None

            print("[SIREN OFF]")


    # =====================================================
    # STATUS
    # =====================================================

    def status(self):

        with self.lock:

            return {
                "active": self.active,
                "reason": self.reason,
                "camera_id": self.camera_id,
                "last_triggered": self.last_triggered
            }


siren_manager = SirenManager()
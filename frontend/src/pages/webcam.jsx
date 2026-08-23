import { useEffect, useRef, useState } from "react";
import API from "../services/api";

import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  LinearProgress,
  Box,
  CircularProgress,
  Chip,
  TextField,
  MenuItem
} from "@mui/material";

export default function Webcam() {
  const processingRef = useRef(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);

  const alarmRef = useRef(new Audio("/alarm.mp3"));

  const [cameraOn, setCameraOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [threatLevel, setThreatLevel] = useState("SAFE");

  const [siren, setSiren] = useState(false);
  const [sirenReason, setSirenReason] = useState("");

  // Camera source
  const [cameraSource, setCameraSource] = useState("local");

  // IP camera URL
  const [ipCameraUrl, setIpCameraUrl] = useState("");

  // --------------------------------------------------
  // ALARM
  // --------------------------------------------------

  const playAlarm = () => {
    const alarm = alarmRef.current;

    alarm.loop = true;
    alarm.volume = 1;

    if (alarm.paused) {
      alarm.play().catch((err) => {
        console.log("Alarm Error:", err);
      });
    }

    setSiren(true);
  };

  const stopAlarm = () => {
    const alarm = alarmRef.current;

    alarm.pause();
    alarm.currentTime = 0;

    setSiren(false);
  };

  // --------------------------------------------------
  // CHECK WHETHER PERSON IS AUTHORIZED
  // --------------------------------------------------

  const isAuthorizedPerson = (data) => {
    // Backend can directly return this field
    if (data.authorized === true) {
      return true;
    }

    if (data.authorized_person === true) {
      return true;
    }

    if (data.person_status === "authorized") {
      return true;
    }

    if (
      typeof data.authorization === "string" &&
      data.authorization.toLowerCase() === "authorized"
    ) {
      return true;
    }

    if (
      typeof data.status === "string" &&
      data.status.toLowerCase() === "authorized"
    ) {
      return true;
    }

    return false;
  };

  // --------------------------------------------------
  // DETERMINE THREAT
  // --------------------------------------------------

  const processThreat = (data) => {
    const prediction =
      data.prediction?.toString().toLowerCase() || "";

    const confidence =
      Number(data.confidence) || 0;

    const authorized = isAuthorizedPerson(data);

    // -----------------------------------------------
    // PERSON
    // -----------------------------------------------

    if (
      prediction === "person" ||
      prediction === "authorized person" ||
      prediction === "unauthorized person"
    ) {
      if (authorized || prediction === "authorized person") {
        // AUTHORIZED PERSON
        stopAlarm();

        setSirenReason(
          "Authorized person detected. Siren disabled."
        );

        setThreatLevel("SAFE");

        return;
      }

      // UNKNOWN / UNAUTHORIZED PERSON
      playAlarm();

      setSirenReason(
        "Unknown or unauthorized person detected."
      );

      if (confidence >= 0.9) {
        setThreatLevel("HIGH");
      } else if (confidence >= 0.7) {
        setThreatLevel("MEDIUM");
      } else {
        setThreatLevel("LOW");
      }

      return;
    }

    // -----------------------------------------------
    // WEAPONS / THREATS
    // -----------------------------------------------

    const threatObjects = [
      "gun",
      "pistol",
      "rifle",
      "weapon",
      "knife",
      "firearm",
      "bomb",
      "explosive",
      "grenade",
      "tank",
      "soldier",
      "threat"
    ];

    const isThreat =
      threatObjects.some((item) =>
        prediction.includes(item)
      );

    if (isThreat) {
      playAlarm();

      setSirenReason(
        `Threat detected: ${data.prediction}`
      );

      if (confidence >= 0.9) {
        setThreatLevel("HIGH");
      } else if (confidence >= 0.7) {
        setThreatLevel("MEDIUM");
      } else {
        setThreatLevel("LOW");
      }

      return;
    }

    // -----------------------------------------------
    // NORMAL OBJECT
    // -----------------------------------------------

    stopAlarm();

    setSirenReason("");

    setThreatLevel("SAFE");
  };

  // --------------------------------------------------
  // START LOCAL CAMERA
  // --------------------------------------------------

  const startLocalCamera = async () => {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        });

      streamRef.current = stream;

      videoRef.current.srcObject = stream;

      setCameraOn(true);

      startDetectionLoop();
    } catch (err) {
      console.error(err);

      alert(
        "Camera permission denied or camera unavailable."
      );
    }
  };

  // --------------------------------------------------
  // IP CAMERA
  // --------------------------------------------------

  const startIPCamera = () => {
    if (!ipCameraUrl.trim()) {
      alert("Enter IP camera URL");

      return;
    }

    /*
      IMPORTANT:

      A browser normally cannot directly open an RTSP URL.

      Example:

      rtsp://192.168.1.100:554/stream

      must first be converted by the backend into
      HTTP/HLS/WebRTC/MJPEG.

      Therefore this URL is sent to the backend.
    */

    API.post("/webcam/ip-camera/start", {
      url: ipCameraUrl
    })
      .then((response) => {
        console.log(
          "IP camera started:",
          response.data
        );

        setCameraOn(true);

        startDetectionLoop();
      })
      .catch((error) => {
        console.error(
          "IP Camera Error:",
          error
        );

        alert(
          "Unable to connect to IP camera."
        );
      });
  };

  // --------------------------------------------------
  // START CAMERA
  // --------------------------------------------------

  const startCamera = async () => {
    if (cameraSource === "local") {
      await startLocalCamera();
    } else {
      startIPCamera();
    }
  };

  // --------------------------------------------------
  // STOP CAMERA
  // --------------------------------------------------

  const stopCamera = () => {
    stopAlarm();

    if (timerRef.current) {
      clearInterval(timerRef.current);

      timerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) => track.stop());
    }

    streamRef.current = null;

    setCameraOn(false);

    setResult(null);

    setThreatLevel("SAFE");

    setSiren(false);

    setSirenReason("");
  };

  // --------------------------------------------------
  // DETECTION LOOP
  // --------------------------------------------------

  const startDetectionLoop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    timerRef.current = setInterval(() => {
      detectFrame();
    }, 2000);
  };

  // --------------------------------------------------
  // CAPTURE FRAME
  // --------------------------------------------------

  const detectFrame = async () => {
    if (processingRef.current) {
      return;
    }

    processingRef.current = true;

    const video = videoRef.current;

    if (!video) {
      processingRef.current = false;

      return;
    }

    if (
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      processingRef.current = false;

      return;
    }

    const canvas =
      document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          processingRef.current = false;

          return;
        }

        const formData = new FormData();

        formData.append(
          "file",
          blob,
          "webcam.jpg"
        );

        try {
          setLoading(true);

          const response =
            await API.post(
              "/prediction/predict",
              formData,
              {
                headers: {
                  "Content-Type":
                    "multipart/form-data"
                }
              }
            );

          console.log(
            "Webcam Prediction:",
            response.data
          );

          setResult(response.data);

          processThreat(response.data);

        } catch (error) {
          console.error(
            "Detection Error:",
            error
          );
        } finally {
          processingRef.current = false;

          setLoading(false);
        }
      },
      "image/jpeg",
      0.75
    );
  };

  // --------------------------------------------------
  // CLEANUP
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: 4 }}
    >

      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
      >
        AI CCTV Surveillance
      </Typography>

      <Card
        elevation={6}
        sx={{ mt: 2 }}
      >

        <CardContent>

          {/* CAMERA SOURCE */}

          <Box
            sx={{
              display: "flex",
              gap: 2,
              mb: 3
            }}
          >

            <TextField
              select
              label="Camera Source"
              value={cameraSource}
              onChange={(e) =>
                setCameraSource(
                  e.target.value
                )
              }
              sx={{ minWidth: 220 }}
              disabled={cameraOn}
            >

              <MenuItem value="local">
                Laptop Camera
              </MenuItem>

              <MenuItem value="ip">
                IP / CCTV Camera
              </MenuItem>

            </TextField>

          </Box>

          {/* IP CAMERA URL */}

          {cameraSource === "ip" && (
            <TextField
              fullWidth
              label="IP Camera URL"
              placeholder="http://192.168.1.100:8080/video"
              value={ipCameraUrl}
              onChange={(e) =>
                setIpCameraUrl(
                  e.target.value
                )
              }
              disabled={cameraOn}
              sx={{ mb: 3 }}
            />
          )}

          {/* VIDEO */}

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            width="100%"
            style={{
              minHeight: 400,
              background: "#000",
              borderRadius: 12,
              border:
                siren
                  ? "5px solid red"
                  : "3px solid #1976d2"
            }}
          />

          {/* CAMERA BUTTON */}

          <Box
            sx={{
              mt: 3,
              display: "flex",
              gap: 2
            }}
          >

            {!cameraOn ? (

              <Button
                variant="contained"
                color="primary"
                onClick={startCamera}
              >
                Start Surveillance
              </Button>

            ) : (

              <Button
                variant="contained"
                color="error"
                onClick={stopCamera}
              >
                Stop Surveillance
              </Button>

            )}

          </Box>

          {/* LOADING */}

          <Box sx={{ mt: 3 }}>

            {loading && (
              <>
                <CircularProgress />

                <Typography sx={{ mt: 1 }}>
                  AI scanning CCTV frame...
                </Typography>
              </>
            )}

          </Box>

          {/* SIREN STATUS */}

          <Box sx={{ mt: 3 }}>

            {siren ? (

              <Alert
                severity="error"
                sx={{
                  fontWeight: "bold",
                  fontSize: 18
                }}
              >
                🚨 SIREN ACTIVE
                <br />
                {sirenReason}
              </Alert>

            ) : (

              <Alert severity="success">

                🔇 SIREN OFF

                {sirenReason && (
                  <>
                    <br />
                    {sirenReason}
                  </>
                )}

              </Alert>

            )}

          </Box>

          {/* RESULT */}

          {result && (

            <Box sx={{ mt: 3 }}>

              {threatLevel === "SAFE" ? (

                <Alert severity="success">
                  ✅ SYSTEM SAFE
                </Alert>

              ) : (

                <Alert severity="error">

                  🚨 THREAT DETECTED

                </Alert>

              )}

              <Typography
                variant="h6"
                sx={{ mt: 2 }}
              >

                Detection:
                {" "}
                {result.prediction}

              </Typography>

              {/* AUTHORIZATION */}

              {result.prediction
                ?.toLowerCase()
                .includes("person") && (

                <Chip
                  sx={{ mt: 2 }}
                  color={
                    isAuthorizedPerson(result)
                      ? "success"
                      : "error"
                  }
                  label={
                    isAuthorizedPerson(result)
                      ? "AUTHORIZED PERSON"
                      : "UNKNOWN / UNAUTHORIZED PERSON"
                  }
                />

              )}

              <Typography sx={{ mt: 2 }}>

                Confidence:
                {" "}
                {(
                  Number(result.confidence) *
                  100
                ).toFixed(2)}
                %

              </Typography>

              <LinearProgress
                variant="determinate"
                value={
                  Number(result.confidence) *
                  100
                }
                sx={{
                  mt: 1,
                  height: 10
                }}
              />

              <Typography
                variant="h6"
                sx={{
                  mt: 2,
                  color:
                    threatLevel === "HIGH"
                      ? "red"
                      : threatLevel === "MEDIUM"
                      ? "orange"
                      : threatLevel === "LOW"
                      ? "goldenrod"
                      : "green"
                }}
              >

                Threat Level:
                {" "}
                {threatLevel}

              </Typography>

              <Typography sx={{ mt: 1 }}>

                Time:
                {" "}
                {new Date().toLocaleTimeString()}

              </Typography>

            </Box>

          )}

        </CardContent>

      </Card>

    </Container>
  );
}
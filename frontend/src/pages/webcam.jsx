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
  Chip
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

  const playAlarm = () => {

    const alarm = alarmRef.current;

    alarm.loop = true;
    alarm.volume = 1;

    if (alarm.paused) {

      alarm.play().catch(err => {

        console.log("Alarm Error:", err);

      });

    }

  };

  const stopAlarm = () => {

    const alarm = alarmRef.current;

    alarm.pause();

    alarm.currentTime = 0;

  };

  const startCamera = async () => {

    try {

      const stream =
        await navigator.mediaDevices.getUserMedia({

          video: true,
          audio: false

        });

      streamRef.current = stream;

      videoRef.current.srcObject = stream;

      setCameraOn(true);

      timerRef.current = setInterval(() => {

        detectFrame();

      }, 3000);

    } catch (err) {

      console.log(err);

      alert("Camera Permission Denied");

    }

  };

  const stopCamera = () => {

    stopAlarm();

    if (timerRef.current) {

      clearInterval(timerRef.current);

      timerRef.current = null;

    }

    if (streamRef.current) {

      streamRef.current
        .getTracks()
        .forEach(track => track.stop());

    }

    streamRef.current = null;

    setCameraOn(false);

    setResult(null);

    setThreatLevel("SAFE");

  };
  const detectFrame = async () => {

    if (processingRef.current) return;

    processingRef.current = true;

    if (!videoRef.current) {

      processingRef.current = false;

      return;

    }

    const video = videoRef.current;

    if (
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {

      processingRef.current = false;

      return;

    }

    const canvas = document.createElement("canvas");

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

    canvas.toBlob(async (blob) => {

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

        const response = await API.post(

          "/prediction/predict",

          formData,

          {

            headers: {

              "Content-Type":
                "multipart/form-data"

            }

          }

        );

        console.log("Prediction:", response.data);

        setResult(response.data);

        const prediction =
          response.data.prediction?.toLowerCase();

        const confidence =
          response.data.confidence;

        const threatObjects = [

          "person",

          "gun",

          "knife",

          "weapon",

          "rifle",

          "soldier",

          "vehicle",

          "tank"

        ];

        if (
          prediction &&
          threatObjects.includes(prediction)
        ) {

          playAlarm();

          if (confidence >= 0.90) {

            setThreatLevel("HIGH");

          } else if (confidence >= 0.70) {

            setThreatLevel("MEDIUM");

          } else {

            setThreatLevel("LOW");

          }

        } else {

          stopAlarm();

          setThreatLevel("SAFE");

        }

      } catch (err) {

        console.log("Detection Error:", err);

      } finally {

        processingRef.current = false;

        setLoading(false);

      }

    }, "image/jpeg");

  };
 useEffect(() => {

    return () => {

      stopCamera();

    };

  }, []);

  return (

    <Container maxWidth="lg" sx={{ mt: 4 }}>

      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
      >
        AI Webcam Surveillance
      </Typography>

      <Card elevation={6} sx={{ mt: 2 }}>

        <CardContent>

          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            width="100%"
            style={{
              borderRadius: 12,
              border: "3px solid #1976d2"
            }}
          />

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
                Start Camera
              </Button>

            ) : (

              <Button
                variant="contained"
                color="error"
                onClick={stopCamera}
              >
                Stop Camera
              </Button>

            )}

          </Box>

          <Box sx={{ mt: 3 }}>

            {loading && <CircularProgress />}

          </Box>

          {result && (

            <Box sx={{ mt: 3 }}>

              {threatLevel === "SAFE" ? (

                <Alert severity="success">
                  ✅ No Threat Detected
                </Alert>

              ) : (

                <>
                  <Alert
                    severity="error"
                    sx={{
                      fontWeight: "bold",
                      fontSize: 20,
                      animation: "blink 1s infinite"
                    }}
                  >
                    🚨 HIGH THREAT DETECTED 🚨
                  </Alert>

                  <style>{`
                    @keyframes blink{
                      0%{background:#ff1744;color:white;}
                      50%{background:white;color:#ff1744;}
                      100%{background:#ff1744;color:white;}
                    }
                  `}</style>
                </>

              )}
               <Typography
                variant="h6"
                sx={{ mt: 2 }}
              >
                Detection :
                {" "}
                {result.prediction}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                Confidence :
                {" "}
                {(result.confidence * 100).toFixed(2)}%
              </Typography>

              <LinearProgress
                variant="determinate"
                value={result.confidence * 100}
                sx={{ mt: 1, height: 10 }}
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
                Threat Level : {threatLevel}
              </Typography>

              <Typography sx={{ mt: 1 }}>
                Time :
                {" "}
                {new Date().toLocaleTimeString()}
              </Typography>

              <Chip
                sx={{ mt: 2 }}
                color={
                  threatLevel === "HIGH"
                    ? "error"
                    : threatLevel === "MEDIUM"
                    ? "warning"
                    : threatLevel === "LOW"
                    ? "secondary"
                    : "success"
                }
                label={
                  threatLevel === "SAFE"
                    ? "SYSTEM SAFE"
                    : "SURVEILLANCE ACTIVE"
                }
              />

            </Box>

          )}

        </CardContent>

      </Card>

    </Container>

  );

}
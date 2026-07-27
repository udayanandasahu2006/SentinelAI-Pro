import { useEffect, useState } from "react";
import API from "../services/api";

import DownloadIcon from "@mui/icons-material/Download";
import {
  Shield,
  Warning,
  Image,
  Speed
} from "@mui/icons-material";

import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Chip,
  LinearProgress,
  Button,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  Snackbar,
  Alert
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LineChart,
  Line
} from "recharts";

export default function Dashboard() {

  const theme = useTheme();

  const [stats, setStats] = useState(null);

  const [search, setSearch] = useState("");

  const [filter, setFilter] = useState("All");

  const [openSnackbar, setOpenSnackbar] = useState(true);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const loadStats = async () => {
    try {
      const res = await API.get("/dashboard/stats");
      setStats(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {

    loadStats();

    const timer = setInterval(() => {
      loadStats();
    }, 5000);

    return () => clearInterval(timer);

  }, []);

  const downloadReport = () => {
    window.open(
      "http://127.0.0.1:8000/report/generate",
      "_blank"
    );
  };

  if (!stats) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh"
        }}
      >
        <CircularProgress size={70} />
      </Box>
    );
  }

  const chartData = [
    {
      name: "Threats",
      value: stats.threats_detected
    },
    {
      name: "Safe",
      value: stats.safe_images
    }
  ];

  const barData = [
    {
      name: "Threats",
      value: stats.threats_detected
    },
    {
      name: "Safe",
      value: stats.safe_images
    }
  ];

  const lineData = [
    { day: "Mon", scans: 15 },
    { day: "Tue", scans: 22 },
    { day: "Wed", scans: 19 },
    { day: "Thu", scans: 28 },
    { day: "Fri", scans: 26 },
    { day: "Sat", scans: 35 },
    { day: "Sun", scans: stats.total_predictions }
  ];

  const historyData = [
    {
      id: 1,
      file: "border_cam_01.jpg",
      status: "Threat",
      confidence: "96%"
    },
    {
      id: 2,
      file: "forest_cam_02.jpg",
      status: "Safe",
      confidence: "99%"
    },
    {
      id: 3,
      file: "drone_capture.jpg",
      status: "Threat",
      confidence: "91%"
    },
    {
      id: 4,
      file: "road_cam.jpg",
      status: "Safe",
      confidence: "98%"
    }
  ];

  const cards = [
    {
      title: "Total Scans",
      value: stats.total_predictions,
      icon: <Image fontSize="large" />,
      color: "#2563eb"
    },
    {
      title: "Threats",
      value: stats.threats_detected,
      icon: <Warning fontSize="large" />,
      color: "#dc2626"
    },
    {
      title: "Safe Images",
      value: stats.safe_images,
      icon: <Shield fontSize="large" />,
      color: "#16a34a"
    },
    {
      title: "Confidence",
      value: `${(stats.average_confidence * 100).toFixed(1)}%`,
      icon: <Speed fontSize="large" />,
      color: "#9333ea"
    }
  ];

  return (

   <Box
  sx={{
    bgcolor: "background.default",
    color: "text.primary",
    minHeight: "100vh",
    p: 3
  }}
> 

      <Container maxWidth={false}>
    {/* ===============================
      Dashboard Header
================================ */}

<Typography
  variant="h3"
  fontWeight="bold"
  sx={{
    mb: 1,
    color: "text.primary",
    textShadow:
      theme.palette.mode === "dark"
        ? "0 0 15px #00E5FF"
        : "none"
  }}
>
  🛰️ SentinelAI Pro Command Center
</Typography>

<Typography
  variant="subtitle1"
  sx={{
    mb: 4,
    color: "text.secondary"
  }}
>
  AI Powered Border Surveillance Dashboard
</Typography>

<Button
  variant="contained"
  startIcon={<DownloadIcon />}
  onClick={downloadReport}
  sx={{
    mb: 4,
    borderRadius: 3,
    px: 4,
    py: 1.3,
    fontWeight: "bold",
    background:
      theme.palette.mode === "dark"
        ? "#00E5FF"
        : "#1976d2",
    color:
      theme.palette.mode === "dark"
        ? "#000"
        : "#fff",
    "&:hover": {
      background:
        theme.palette.mode === "dark"
          ? "#38BDF8"
          : "#1565c0"
    }
  }}
>
  Download PDF Report
</Button>
 {/* ===============================
      Animated Statistics Cards
================================ */}

<Grid container spacing={3} sx={{ mb: 4 }}>

  {cards.map((card) => (

    <Grid item xs={12} sm={6} md={3} key={card.title}>

      <Card
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          transition: "0.35s",

          background:
            theme.palette.mode === "dark"
              ? `linear-gradient(135deg, ${card.color}, #0f172a)`
              : "#ffffff",

          color:
            theme.palette.mode === "dark"
              ? "#ffffff"
              : "#111827",

          boxShadow:
            theme.palette.mode === "dark"
              ? "0 8px 30px rgba(0,0,0,.35)"
              : "0 8px 20px rgba(0,0,0,.10)",

          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: `0 0 25px ${card.color}`
          }
        }}
      >

        <CardContent>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >

            <Box>

              <Typography
                variant="subtitle1"
                fontWeight="bold"
              >
                {card.title}
              </Typography>

              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{ mt: 1 }}
              >
                {card.value}
              </Typography>

            </Box>

            <Box
              sx={{
                color: card.color,
                fontSize: 60
              }}
            >
              {card.icon}
            </Box>

          </Box>

        </CardContent>

        <Box
          sx={{
            height: 6,
            bgcolor: card.color
          }}
        />

      </Card>

    </Grid>

  ))}

</Grid>
   {/* ===============================
        AI Command Center
================================ */}

<Grid container spacing={3} sx={{ mt: 3 }}>

  {/* AI Incident Summary */}

  <Grid item xs={12} md={6}>

    <Card
      sx={{
        borderRadius: 4,
        bgcolor: "background.paper",
        color: "text.primary",
        boxShadow: 6,
      }}
    >

      <CardContent>

        <Typography variant="h6" fontWeight="bold" mb={3}>
          🤖 AI Incident Summary
        </Typography>

        <Typography sx={{ mb: 2 }}>
          ✔ Total Images Analysed:
          <b> {stats.total_predictions}</b>
        </Typography>

        <Typography sx={{ mb: 2 }}>
          🚨 Threats Detected:
          <b style={{ color: "#ef4444" }}>
            {" "}
            {stats.threats_detected}
          </b>
        </Typography>

        <Typography sx={{ mb: 2 }}>
          🛡 Safe Images:
          <b style={{ color: "#22c55e" }}>
            {" "}
            {stats.safe_images}
          </b>
        </Typography>

        <Typography sx={{ mb: 2 }}>
          🎯 Average Confidence:
          <b style={{ color: "#3b82f6" }}>
            {" "}
            {(stats.average_confidence * 100).toFixed(1)}%
          </b>
        </Typography>

        <Chip
          color="success"
          label="AI Engine Running"
          sx={{ mt: 2 }}
        />

      </CardContent>

    </Card>

  </Grid>

  {/* System Status */}

  <Grid item xs={12} md={6}>

    <Card
      sx={{
        borderRadius: 4,
        bgcolor: "background.paper",
        color: "text.primary",
        boxShadow: 6,
      }}
    >

      <CardContent>

        <Typography variant="h6" fontWeight="bold" mb={3}>
          🛰 System Status
        </Typography>

        <Typography mb={2}>
          Backend :
          <Chip
            label="Running"
            color="success"
            size="small"
            sx={{ ml: 1 }}
          />
        </Typography>

        <Typography mb={2}>
          Database :
          <Chip
            label="Connected"
            color="success"
            size="small"
            sx={{ ml: 1 }}
          />
        </Typography>

        <Typography mb={2}>
          Detection Engine :
          <Chip
            label="YOLOv8 Active"
            color="primary"
            size="small"
            sx={{ ml: 1 }}
          />
        </Typography>

        <Typography>
          Last Scan :
          <b>
            {" "}
            {new Date().toLocaleTimeString()}
          </b>
        </Typography>

      </CardContent>

    </Card>

  </Grid>

</Grid>
{/* ==========================
      Live Threat Alerts & Recent Activity
========================== */}

<Grid container spacing={3} sx={{ mt: 3 }}>

  {/* Live Threat Alerts */}

  <Grid item xs={12} md={6}>

    <Card
      sx={{
        borderRadius: 4,
        bgcolor: "background.paper",
        color: "text.primary",
        boxShadow: 5
      }}
    >
      <CardContent>

        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
        >
          🚨 Live Threat Alerts
        </Typography>

        <Chip
          label="Border Zone Secure"
          color="success"
          sx={{ mb: 2 }}
        />

        <Typography sx={{ mb: 1 }}>
          ✔ AI Monitoring Active
        </Typography>

        <Typography sx={{ mb: 1 }}>
          ✔ Camera Network Connected
        </Typography>

        <Typography sx={{ mb: 1 }}>
          ✔ YOLO Detection Running
        </Typography>

        <Typography
          sx={{
            mt: 3,
            color: "error.main",
            fontWeight: "bold"
          }}
        >
          No Critical Threat Detected
        </Typography>

      </CardContent>
    </Card>

  </Grid>

  {/* Recent Activity */}

  <Grid item xs={12} md={6}>

    <Card
      sx={{
        borderRadius: 4,
        bgcolor: "background.paper",
        color: "text.primary",
        boxShadow: 5
      }}
    >
      <CardContent>

        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
        >
          📜 Recent Activity
        </Typography>

        <Typography sx={{ mb: 1 }}>
          🛰 Camera Scan Completed
        </Typography>

        <Typography sx={{ mb: 1 }}>
          📸 Image Detection Finished
        </Typography>

        <Typography sx={{ mb: 1 }}>
          🎯 Threat Confidence Updated
        </Typography>

        <Typography sx={{ mb: 1 }}>
          📄 PDF Report Generated
        </Typography>

        <Typography
          sx={{
            mt: 2,
            color: "text.secondary"
          }}
        >
          Last Update: {new Date().toLocaleTimeString()}
        </Typography>

      </CardContent>
    </Card>

  </Grid>

</Grid>
{/* ==========================
      Quick Actions & Mission Progress
========================== */}

<Grid container spacing={3} sx={{ mt: 3 }}>

  {/* Quick Actions */}

  <Grid item xs={12} md={6}>

    <Card
      sx={{
        borderRadius: 4,
        bgcolor: "background.paper",
        color: "text.primary",
        boxShadow: 5
      }}
    >
      <CardContent>

        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
        >
          ⚡ Quick Actions
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>

          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
            >
              Scan Image
            </Button>
          </Grid>

          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="success"
            >
              Open Webcam
            </Button>
          </Grid>

          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="warning"
            >
              Video Detection
            </Button>
          </Grid>

          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
            >
              View History
            </Button>
          </Grid>

        </Grid>

      </CardContent>

    </Card>

  </Grid>

  {/* Mission Progress */}

  <Grid item xs={12} md={6}>

    <Card
      sx={{
        borderRadius: 4,
        bgcolor: "background.paper",
        color: "text.primary",
        boxShadow: 5
      }}
    >

      <CardContent>

        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
        >
          🎯 Mission Progress
        </Typography>

        <Typography sx={{ mt: 2 }}>
          AI Accuracy
        </Typography>

        <LinearProgress
          variant="determinate"
          value={95}
          sx={{
            height: 10,
            borderRadius: 5,
            mb: 3
          }}
        />

        <Typography>
          System Health
        </Typography>

        <LinearProgress
          variant="determinate"
          value={99}
          color="success"
          sx={{
            height: 10,
            borderRadius: 5,
            mb: 3
          }}
        />

        <Typography>
          Camera Network
        </Typography>

        <LinearProgress
          variant="determinate"
          value={92}
          color="warning"
          sx={{
            height: 10,
            borderRadius: 5
          }}
        />

      </CardContent>

    </Card>

  </Grid>

</Grid>
{/* ===============================
      Search & Detection History
================================ */}

<Grid container spacing={3} sx={{ mt: 3 }}>

  <Grid item xs={12}>

    <Card
      sx={{
        borderRadius: 4,
        bgcolor: "background.paper",
        color: "text.primary",
        boxShadow: 5
      }}
    >

      <CardContent>

        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
        >
          🔍 Detection History
        </Typography>

        {/* Search & Filter */}

        <Grid container spacing={2} sx={{ mb: 3 }}>

          <Grid item xs={12} md={8}>

            <TextField
              fullWidth
              label="Search File"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </Grid>

          <Grid item xs={12} md={4}>

            <TextField
              select
              fullWidth
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >

              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Threat">Threat</MenuItem>
              <MenuItem value="Safe">Safe</MenuItem>

            </TextField>

          </Grid>

        </Grid>

        {/* History Table */}

        <TableContainer component={Paper}>

          <Table>

            <TableHead>

              <TableRow>

                <TableCell>ID</TableCell>
                <TableCell>File Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Confidence</TableCell>

              </TableRow>

            </TableHead>

            <TableBody>

              {historyData
                .filter(
                  (row) =>
                    (filter === "All" || row.status === filter) &&
                    row.file
                      .toLowerCase()
                      .includes(search.toLowerCase())
                )
                .map((row) => (

                  <TableRow key={row.id}>

                    <TableCell>{row.id}</TableCell>

                    <TableCell>{row.file}</TableCell>

                    <TableCell>

                      <Chip
                        label={row.status}
                        color={
                          row.status === "Threat"
                            ? "error"
                            : "success"
                        }
                      />

                    </TableCell>

                    <TableCell>{row.confidence}</TableCell>

                  </TableRow>

                ))}

            </TableBody>

          </Table>

        </TableContainer>

      </CardContent>

    </Card>

  </Grid>

</Grid>
{/* ==========================
      Final Command Center
========================== */}

<Grid container spacing={3} sx={{ mt: 3 }}>

  {/* Live Status */}

  <Grid item xs={12} md={6}>

    <Card
      sx={{
        borderRadius: 4,
        bgcolor: "background.paper",
        color: "text.primary",
        boxShadow: 5
      }}
    >

      <CardContent>

        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
        >
          🔴 Live Status
        </Typography>

        <Box
          sx={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            bgcolor: "#22c55e",
            animation: "pulse 1.5s infinite",
            mb: 2
          }}
        />

        <Typography>
          Border Surveillance Active
        </Typography>

        <Typography>
          AI Detection Running
        </Typography>

        <Typography>
          Cameras Connected
        </Typography>

      </CardContent>

    </Card>

  </Grid>

  {/* System Performance */}

  <Grid item xs={12} md={6}>

    <Card
      sx={{
        borderRadius: 4,
        bgcolor: "background.paper",
        color: "text.primary",
        boxShadow: 5
      }}
    >

      <CardContent>

        <Typography
          variant="h6"
          fontWeight="bold"
          gutterBottom
        >
          ⚙ System Performance
        </Typography>

        <Typography>CPU Usage</Typography>

        <LinearProgress
          variant="determinate"
          value={45}
          sx={{ mb: 2 }}
        />

        <Typography>GPU Usage</Typography>

        <LinearProgress
          color="success"
          variant="determinate"
          value={72}
          sx={{ mb: 2 }}
        />

        <Typography>Memory Usage</Typography>

        <LinearProgress
          color="warning"
          variant="determinate"
          value={61}
        />

      </CardContent>

    </Card>

  </Grid>

</Grid>

{/* Snackbar */}

<Snackbar
  open={openSnackbar}
  autoHideDuration={4000}
  onClose={handleCloseSnackbar}
>

  <Alert
    severity="success"
    variant="filled"
    onClose={handleCloseSnackbar}
  >
    SentinelAI Pro Dashboard Ready 🚀
  </Alert>

</Snackbar>

{/* Footer */}

<Box
  sx={{
    mt: 5,
    textAlign: "center",
    py: 3,
    color: "text.secondary"
  }}
>

  <Typography variant="body2">
    SentinelAI Pro © 2026
  </Typography>

  <Typography variant="caption">
    AI Powered Border Surveillance System
  </Typography>

</Box>

</Container>

</Box>
  )
}
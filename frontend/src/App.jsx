import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Predict from "./pages/Predict";
import History from "./pages/History";
import Webcam from "./pages/Webcam";
import VideoDetection from "./pages/VideoDetection";

export default function App() {
  return (
    <Box sx={{ display: "flex" }}>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
    <Box
  component="main"
  sx={{
    flexGrow: 1,
    ml: "240px",
    bgcolor: "background.default",
    minHeight: "100vh"
  }}
>

        <Routes>

          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/predict"
            element={<Predict />}
          />

          <Route
            path="/webcam"
            element={<Webcam />}
          />

          <Route
            path="/video"
            element={<VideoDetection />}
          />

          <Route
            path="/history"
            element={<History />}
          />

        </Routes>

      </Box>

    </Box>
  );
}
import { Routes, Route, useLocation } from "react-router-dom";
import { Box } from "@mui/material";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Predict from "./pages/Predict";
import History from "./pages/History";
import Webcam from "./pages/webcam";
import VideoDetection from "./pages/videodetection";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  const location = useLocation();

  const hideSidebar =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <Box sx={{ display: "flex" }}>

      {!hideSidebar && <Sidebar />}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: hideSidebar ? 0 : "240px",
          bgcolor: "background.default",
          minHeight: "100vh"
        }}
      >
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={<Dashboard />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/webcam" element={<Webcam />} />
          <Route path="/video" element={<VideoDetection />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Box>
    </Box>
  );
}
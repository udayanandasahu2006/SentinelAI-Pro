import { Box, Toolbar } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box sx={{ flexGrow: 1 }}>
        <Navbar />
        <Toolbar />

        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
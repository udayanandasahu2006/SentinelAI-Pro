import { AppBar, Toolbar, Typography, Avatar, Box } from "@mui/material";

export default function Navbar() {
  return (
    <AppBar
      position="fixed"
      sx={{
        ml: "240px",
        width: "calc(100% - 240px)",
        background: "#1976d2",
      }}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          SentinelAI Pro Dashboard
        </Typography>

        <Box display="flex" alignItems="center" gap={2}>
          <Typography>Udayananda</Typography>
          <Avatar>U</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
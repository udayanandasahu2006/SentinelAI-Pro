import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  Button,
  IconButton
} from "@mui/material";

import {
  Dashboard,
  ImageSearch,
  Videocam,
  History,
  CameraAlt,
  Logout,
  Security,
  Dns
} from "@mui/icons-material";

import { NavLink, useNavigate } from "react-router-dom";

import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { useTheme } from "@mui/material/styles";

import { ColorModeContext } from "../context/ThemeContext";

const drawerWidth = 240;

export default function Sidebar() {

  const { user, logout } =
    useContext(AuthContext);

  const navigate = useNavigate();

  const theme = useTheme();

  const colorMode =
    useContext(ColorModeContext);

  // --------------------------------------------------
  // MENU
  // --------------------------------------------------

  const menu = [

    {
      name: "Dashboard",
      path: "/",
      icon: <Dashboard />
    },

    {
      name: "Image Detection",
      path: "/predict",
      icon: <ImageSearch />
    },

    {
      name: "Webcam Detection",
      path: "/webcam",
      icon: <CameraAlt />
    },

    {
      name: "Video Detection",
      path: "/video",
      icon: <Videocam />
    },

  

    {
      name: "History",
      path: "/history",
      icon: <History />
    },
    
  ];

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------

  const handleLogout = () => {

    logout();

    navigate("/login");

  };

  return (

    <Drawer

      variant="permanent"

      sx={{

        width: drawerWidth,

        flexShrink: 0,

        "& .MuiDrawer-paper": {

          width: drawerWidth,

          boxSizing: "border-box",

          background:
            "linear-gradient(180deg,#0f172a,#020617)",

          color: "white",

          borderRight:
            "1px solid #1e293b"

        }

      }}

    >

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <Box
        sx={{
          textAlign: "center",
          p: 2
        }}
      >

        <Security
          sx={{
            fontSize: 45,
            color: "#38bdf8"
          }}
        />

        <Typography
          variant="h6"
          fontWeight="bold"
        >
          SentinelAI Pro
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: "#94a3b8"
          }}
        >
          AI Border Surveillance
        </Typography>

      </Box>

      <Divider
        sx={{
          background: "#475569"
        }}
      />

      {/* ================================================= */}
      {/* MENU */}
      {/* ================================================= */}

      <List sx={{ px: 1 }}>

        {menu.map((item) => (

          <ListItem
            key={item.name}
            disablePadding
            sx={{ mb: 0.5 }}
          >

            <ListItemButton

              component={NavLink}

              to={item.path}

              sx={{

                color: "white",

                borderRadius: 2,

                minHeight: 48,

                "&.active": {

                  background:
                    "linear-gradient(90deg,#0284c7,#0369a1)",

                  boxShadow:
                    "0 4px 12px rgba(2,132,199,0.3)"

                },

                "&:hover": {

                  background:
                    "#1e293b"

                }

              }}

            >

              <ListItemIcon
                sx={{
                  color: "white",
                  minWidth: 42
                }}
              >

                {item.icon}

              </ListItemIcon>

              <ListItemText
                primary={item.name}
              />

            </ListItemButton>

          </ListItem>

        ))}

      </List>

      

      {/* ================================================= */}
      {/* BOTTOM USER SECTION */}
      {/* ================================================= */}

      <Box

        sx={{

          position: "absolute",

          bottom: 15,

          width: "100%",

          px: 2,

          boxSizing: "border-box"

        }}

      >

        <Divider
          sx={{
            mb: 2,
            background: "#475569"
          }}
        />

        <Typography
          variant="body2"
        >
          👤 Logged User
        </Typography>

        <Typography
          variant="caption"
          sx={{
            wordBreak: "break-word",
            color: "#94a3b8"
          }}
        >

          {user?.email || "User"}

        </Typography>

        {/* ================================================= */}
        {/* LOGOUT */}
        {/* ================================================= */}

        <Button

          fullWidth

          variant="contained"

          color="error"

          startIcon={<Logout />}

          sx={{
            mt: 2
          }}

          onClick={handleLogout}

        >

          Logout

        </Button>

        {/* ================================================= */}
        {/* THEME */}
        {/* ================================================= */}

        <Box
          sx={{
            textAlign: "center",
            mt: 1
          }}
        >

          <Typography
            variant="caption"
            sx={{
              color: "white",
              display: "block",
              mb: 0.5
            }}
          >
            Theme
          </Typography>

          <IconButton

            onClick={
              colorMode.toggleColorMode
            }

            sx={{

              color: "white",

              transition:
                "all 0.5s",

              "&:hover": {

                transform:
                  "rotate(180deg) scale(1.2)"

              }

            }}

          >

            {theme.palette.mode === "dark"

              ? <LightModeIcon />

              : <DarkModeIcon />

            }

          </IconButton>

        </Box>

      </Box>

    </Drawer>

  );
}
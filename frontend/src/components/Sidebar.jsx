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
  Button
} from "@mui/material";


import {
  Dashboard,
  ImageSearch,
  Videocam,
  History,
  CameraAlt,
  Logout,
  Security
} from "@mui/icons-material";


import { NavLink, useNavigate } from "react-router-dom";

import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";


import { IconButton } from "@mui/material";

import DarkModeIcon from "@mui/icons-material/DarkMode";

import LightModeIcon from "@mui/icons-material/LightMode";

import { useTheme } from "@mui/material/styles";

import { ColorModeContext } from "../context/ThemeContext";

const drawerWidth = 240;



export default function Sidebar(){


const {user, logout}=useContext(AuthContext);


const navigate = useNavigate();



const menu=[

{
name:"Dashboard",
path:"/",
icon:<Dashboard/>
},

{
name:"Image Detection",
path:"/predict",
icon:<ImageSearch/>
},

{
name:"Webcam Detection",
path:"/webcam",
icon:<CameraAlt/>
},

{
name:"Video Detection",
path:"/video",
icon:<Videocam/>
},

{
name:"History",
path:"/history",
icon:<History/>
}

];



const handleLogout=()=>{


logout();


navigate("/login");


};

const theme = useTheme();

const colorMode = useContext(ColorModeContext);


return(


<Drawer


variant="permanent"


sx={{

width:drawerWidth,


"& .MuiDrawer-paper":{

width:drawerWidth,

boxSizing:"border-box",

background:
"linear-gradient(180deg,#0f172a,#020617)",

color:"white"

}

}}



>


{/* Header */}


<Box

sx={{

textAlign:"center",

p:2

}}

>


<Security

sx={{

fontSize:45,

color:"#38bdf8"

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

>

AI Border Surveillance

</Typography>


</Box>




<Divider

sx={{

background:"#475569"

}}

/>




{/* Menu */}


<List>


{

menu.map((item)=>(


<ListItem

key={item.name}

disablePadding

>


<ListItemButton


component={NavLink}


to={item.path}



sx={{

color:"white",


"&.active":{

background:"#0284c7",

borderRadius:2

},


"&:hover":{

background:"#1e293b"

}

}}



>


<ListItemIcon

sx={{

color:"white"

}}

>

{item.icon}

</ListItemIcon>



<ListItemText

primary={item.name}

/>



</ListItemButton>


</ListItem>


))


}



</List>







{/* Bottom User Section */}


<Box


sx={{

position:"absolute",

bottom:20,

width:"100%",

px:2

}}



>


<Divider

sx={{

mb:2,

background:"#475569"

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

wordBreak:"break-word"

}}

>

{user?.email || "User"}

</Typography>




<Button


fullWidth


variant="contained"


color="error"


startIcon={<Logout/>}



sx={{

mt:2

}}



onClick={handleLogout}



>


Logout


</Button>
<Box
  sx={{
    textAlign: "center",
    mt: 2
  }}
>

  <Typography
    variant="caption"
    sx={{
      color: "white",
      display: "block",
      mb: 1
    }}
  >
    Theme
  </Typography>

  <IconButton
    onClick={colorMode.toggleColorMode}
    sx={{
      color: "white",
      transition: "all 0.5s",
      "&:hover": {
        transform: "rotate(180deg) scale(1.2)"
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
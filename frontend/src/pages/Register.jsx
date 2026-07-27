import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography
} from "@mui/material";


export default function Register(){


const navigate = useNavigate();


const [username,setUsername]=useState("");
const [email,setEmail]=useState("");
const [password,setPassword]=useState("");



const register=async()=>{

try{


await axios.post(

"http://127.0.0.1:8000/auth/register",

null,

{

params:{

username,
email,
password

}

}

);


alert("Registration successful");


navigate("/login");


}

catch(error){

console.log(error);

alert("Registration failed");

}


};



return(

<Container sx={{mt:10}}>


<Card

sx={{

maxWidth:450,

mx:"auto",

borderRadius:4,

boxShadow:8

}}

>


<CardContent>


<Typography

variant="h4"

fontWeight="bold"

align="center"

>

🛰️ Create Account

</Typography>



<TextField

fullWidth

label="Username"

margin="normal"

onChange={(e)=>setUsername(e.target.value)}

/>



<TextField

fullWidth

label="Email"

margin="normal"

onChange={(e)=>setEmail(e.target.value)}

/>



<TextField

fullWidth

label="Password"

type="password"

margin="normal"

onChange={(e)=>setPassword(e.target.value)}

/>



<Button

fullWidth

variant="contained"

sx={{mt:3}}

onClick={register}

>

Register

</Button>


</CardContent>


</Card>


</Container>

);

}
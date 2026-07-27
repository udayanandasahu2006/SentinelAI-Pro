import {useState,useContext} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

import {
Container,
Card,
CardContent,
TextField,
Button,
Typography
} from "@mui/material";


import {AuthContext} from "../context/AuthContext";
import { Link } from "react-router-dom";


export default function Login(){


const [email,setEmail]=useState("");

const [password,setPassword]=useState("");

const {login}=useContext(AuthContext);

const navigate=useNavigate();



const handleLogin=async()=>{


try{


const res=await axios.post(

"http://127.0.0.1:8000/auth/login",

null,

{

params:{

email,

password

}

}

);



login(
res.data.access_token,

{
email:email
}
);



navigate("/");


}

catch(err){

alert(
"Invalid Login"
);

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

🛰️ SentinelAI Login

</Typography>



<TextField

fullWidth

label="Email"

margin="normal"

onChange={
e=>setEmail(e.target.value)
}

/>



<TextField

fullWidth

label="Password"

type="password"

margin="normal"

onChange={
e=>setPassword(e.target.value)
}

/>



<Button

fullWidth

variant="contained"

sx={{mt:3}}

onClick={handleLogin}

>

Login

</Button>

<Button

fullWidth

sx={{mt:2}}

component={Link}

to="/register"

>

Create New Account

</Button>

</CardContent>


</Card>


</Container>


);


}
import {useState} from "react";
import axios from "axios";

import {
Container,
Typography,
Button,
Card,
CardContent,
Box,
LinearProgress,
CircularProgress,
Alert
} from "@mui/material";


import {
CloudUpload,
PlayArrow,
SmartToy
} from "@mui/icons-material";


export default function VideoDetection(){


const [video,setVideo]=useState(null);

const [loading,setLoading]=useState(false);

const [progress,setProgress]=useState(0);

const [result,setResult]=useState(null);



const uploadVideo=(e)=>{

setVideo(e.target.files[0]);

setResult(null);

}



const processVideo=async()=>{


if(!video){

alert("Select video");

return;

}



const data=new FormData();

data.append(
"file",
video
);



setLoading(true);



let timer=setInterval(()=>{

setProgress(
old=> old>=90 ? 90 : old+10
);

},500);



try{


const res=await axios.post(

"http://127.0.0.1:8000/video/predict",

data,

{

headers:{

"Content-Type":
"multipart/form-data"

}

}

);



setResult(res.data);

setProgress(100);


}

catch(err){

console.log(err);

alert("Failed");

}



clearInterval(timer);

setLoading(false);



}




return(


<Container sx={{mt:4}}>


<Typography

variant="h4"

fontWeight="bold"

>

🎥 AI Video Surveillance

</Typography>



<Card

sx={{

mt:4,

borderRadius:4,

boxShadow:8

}}

>


<CardContent>


<Box textAlign="center">


<input

type="file"

accept="video/*"

id="video"

hidden

onChange={uploadVideo}

/>



<label htmlFor="video">


<Button

component="span"

variant="contained"

startIcon={<CloudUpload/>}

>

Upload Video

</Button>


</label>



{
video &&

<Typography sx={{mt:2}}>

Selected:
{video.name}

</Typography>

}



<Button

sx={{mt:3}}

variant="contained"

color="success"

startIcon={<PlayArrow/>}

onClick={processVideo}

>

Start AI Detection

</Button>





{

loading &&

<Box sx={{mt:4}}>


<SmartToy

sx={{

fontSize:50,

animation:"spin 2s linear infinite"

}}

/>


<Typography>

YOLO AI Scanning Frames...

</Typography>


<LinearProgress

variant="determinate"

value={progress}

/>


<CircularProgress

sx={{mt:2}}

/>


</Box>


}





{

result &&

<Alert

severity="success"

sx={{mt:4}}

>


<Typography variant="h6">

Detection Completed ✅

</Typography>


<Typography>

Total Objects:

{result.total_detections}

</Typography>



<video

width="700"

controls

style={{

marginTop:"20px",

borderRadius:"15px"

}}

>


<source

src={result.video_url}

type="video/mp4"

/>


</video>



</Alert>


}



</Box>


</CardContent>


</Card>


</Container>


);


}
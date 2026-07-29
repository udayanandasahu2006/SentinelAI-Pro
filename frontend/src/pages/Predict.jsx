import { useState } from "react";
import API from "../api";

import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  CircularProgress,
  Alert,
  LinearProgress
} from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SecurityIcon from "@mui/icons-material/Security";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";

import { motion } from "framer-motion";


export default function Predict() {


  const [image,setImage] = useState(null);

  const [preview,setPreview] = useState(null);

  const [loading,setLoading] = useState(false);

  const [result,setResult] = useState(null);



  const handleImage=(e)=>{

    const file=e.target.files[0];

    if(file){

      setImage(file);

      setPreview(URL.createObjectURL(file));

      setResult(null);

    }

  };




  const predictImage=async()=>{


    if(!image){

      alert("Please select an image");

      return;

    }


    const formData=new FormData();

    formData.append(
      "file",
      image
    );


    try{


      setLoading(true);


      const response = await API.post(
    "/prediction/predict",
    formData,
    {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    }
);


      setResult(response.data);


    }

    catch(error){

      console.log(error);

      alert(
        "Prediction failed"
      );

    }


    finally{

      setLoading(false);

    }


  };





  return(


    <Container sx={{mt:4}}>


      <motion.div

        initial={{
          opacity:0,
          y:-30
        }}

        animate={{
          opacity:1,
          y:0
        }}

      >

      <Typography

        variant="h4"

        fontWeight="bold"

        gutterBottom

      >

        🛡️ AI Image Threat Detection

      </Typography>


      </motion.div>




      <Card

        sx={{

          mt:3,

          borderRadius:4,

          p:2

        }}

        elevation={8}

      >


      <CardContent>


      <Box

        sx={{

          textAlign:"center"

        }}

      >



      <input

        accept="image/*"

        type="file"

        id="upload"

        hidden

        onChange={handleImage}

      />


      <label htmlFor="upload">


      <Button

        component="span"

        variant="contained"

        startIcon={<CloudUploadIcon/>}

      >

        Upload Image

      </Button>


      </label>





      {
        preview &&

        <motion.div

          initial={{
            opacity:0,
            scale:0.8
          }}

          animate={{
            opacity:1,
            scale:1
          }}

        >

        <Box

          component="img"

          src={preview}

          sx={{

            width:350,

            mt:3,

            borderRadius:3,

            boxShadow:5

          }}

        />


        </motion.div>

      }





      <br/>


      <Button

        sx={{mt:3}}

        variant="contained"

        color="success"

        startIcon={<SecurityIcon/>}

        onClick={predictImage}

      >

        Start AI Detection

      </Button>





      {
        loading &&

        <Box sx={{mt:3}}>


          <Typography>

            AI is scanning image...

          </Typography>


          <LinearProgress/>


          <CircularProgress

            sx={{mt:2}}

          />


        </Box>

      }





      {

      result &&


      <motion.div

        initial={{
          opacity:0,
          y:30
        }}

        animate={{
          opacity:1,
          y:0
        }}

      >


      <Alert

        sx={{mt:4}}

        severity={

          result.prediction === 
          "No Threat Detected"

          ?

          "success"

          :

          "error"

        }


      >


      {

      result.prediction ===
      "No Threat Detected"

      ?

      <CheckCircleIcon/>

      :

      <WarningIcon/>

      }



      <Typography

        variant="h6"

      >

      Detection Result

      </Typography>


      <Typography>

      Object:
      {" "}
      {result.prediction}

      </Typography>



      <Typography>

      Confidence:
      {" "}
      {(result.confidence*100).toFixed(2)}%

      </Typography>



      </Alert>


      </motion.div>


      }


      </Box>


      </CardContent>


      </Card>


    </Container>


  );

}
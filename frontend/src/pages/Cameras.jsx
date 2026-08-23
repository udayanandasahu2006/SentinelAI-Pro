import { useEffect, useState } from "react";
import API from "../services/api";

import {
    Container,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Box,
    Grid,
    Chip
} from "@mui/material";

export default function Cameras() {

    const [cameras, setCameras] = useState([]);

    const [name, setName] = useState("");

    const [url, setUrl] = useState("");

    const [username, setUsername] = useState("");

    const [password, setPassword] = useState("");


    const loadCameras = async () => {

        try {

            const response =
                await API.get("/cameras/");

            setCameras(response.data);

        } catch (error) {

            console.error(error);

        }

    };


    useEffect(() => {

        loadCameras();

    }, []);


    const addCamera = async () => {

        if (!name || !url) {

            alert(
                "Camera name and URL are required"
            );

            return;

        }


        try {

            await API.post(
                "/cameras/",
                {
                    name,
                    url,
                    username:
                        username || null,
                    password:
                        password || null
                }
            );


            setName("");

            setUrl("");

            setUsername("");

            setPassword("");

            loadCameras();

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.detail ||
                "Failed to add camera"
            );

        }

    };


    const testCamera =
        async (camera) => {

        try {

            const response =
                await API.get(
                    `/cameras/${camera.id}/test`
                );

            alert(
                response.data.online
                    ? "Camera is ONLINE"
                    : "Camera is OFFLINE"
            );

        } catch (error) {

            alert(
                "Unable to test camera"
            );

        }

    };


    const deleteCamera =
        async (id) => {

        try {

            await API.delete(
                `/cameras/${id}`
            );

            loadCameras();

        } catch (error) {

            console.error(error);

        }

    };


    return (

        <Container sx={{ mt: 4 }}>

            <Typography
                variant="h4"
                fontWeight="bold"
            >
                📹 CCTV Camera Management
            </Typography>


            <Card sx={{ mt: 3 }}>

                <CardContent>

                    <Typography
                        variant="h6"
                        gutterBottom
                    >
                        Add CCTV / IP Camera
                    </Typography>


                    <Box
                        sx={{
                            display: "grid",
                            gap: 2
                        }}
                    >

                        <TextField
                            label="Camera Name"
                            value={name}
                            onChange={
                                e =>
                                    setName(
                                        e.target.value
                                    )
                            }
                        />


                        <TextField
                            label="IP / RTSP URL"
                            placeholder="rtsp://192.168.1.100:554/stream"
                            value={url}
                            onChange={
                                e =>
                                    setUrl(
                                        e.target.value
                                    )
                            }
                        />


                        <TextField
                            label="Username (optional)"
                            value={username}
                            onChange={
                                e =>
                                    setUsername(
                                        e.target.value
                                    )
                            }
                        />


                        <TextField
                            label="Password (optional)"
                            type="password"
                            value={password}
                            onChange={
                                e =>
                                    setPassword(
                                        e.target.value
                                    )
                            }
                        />


                        <Button
                            variant="contained"
                            onClick={addCamera}
                        >
                            Add Camera
                        </Button>

                    </Box>

                </CardContent>

            </Card>


            <Grid
                container
                spacing={3}
                sx={{ mt: 1 }}
            >

                {cameras.map(
                    camera => (

                    <Grid
                        item
                        xs={12}
                        md={6}
                        lg={4}
                        key={camera.id}
                    >

                        <Card>

                            <CardContent>

                                <Typography
                                    variant="h6"
                                >
                                    📹 {camera.name}
                                </Typography>


                                <Typography
                                    sx={{
                                        mt: 1,
                                        wordBreak:
                                            "break-all"
                                    }}
                                >
                                    {camera.url}
                                </Typography>


                                <Chip
                                    sx={{ mt: 2 }}
                                    label={
                                        camera.active
                                            ? "ACTIVE"
                                            : "DISABLED"
                                    }
                                    color={
                                        camera.active
                                            ? "success"
                                            : "default"
                                    }
                                />


                                <Box sx={{ mt: 2 }}>

                                    <Button
                                        variant="outlined"
                                        onClick={() =>
                                            testCamera(
                                                camera
                                            )
                                        }
                                    >
                                        Test Camera
                                    </Button>


                                    <Button
                                        color="error"
                                        sx={{ ml: 1 }}
                                        onClick={() =>
                                            deleteCamera(
                                                camera.id
                                            )
                                        }
                                    >
                                        Delete
                                    </Button>

                                </Box>

                            </CardContent>

                        </Card>

                    </Grid>

                ))}

            </Grid>

        </Container>

    );
}
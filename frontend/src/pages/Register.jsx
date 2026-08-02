import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";

import API from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const register = async () => {
    try {
      setError("");

      await API.post(
        "/auth/register",
        null,
        {
          params: {
            username,
            email,
            password,
          },
        }
      );

      alert("Registration Successful");

      navigate("/login");
    } catch (err) {
      console.log(err);

      if (err.response) {
        setError(err.response.data.detail || "Registration Failed");
      } else {
        setError("Cannot connect to server");
      }
    }
  };

  return (
    <Container sx={{ mt: 10 }}>
      <Card
        sx={{
          maxWidth: 450,
          mx: "auto",
          borderRadius: 4,
          boxShadow: 8,
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            fontWeight="bold"
            align="center"
            gutterBottom
          >
            🛰️ Create Account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Username"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            onClick={register}
          >
            Register
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
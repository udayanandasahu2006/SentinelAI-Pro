import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";

import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";

import { AuthContext } from "../context/AuthContext";
import API from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError("");

      const res = await API.post(
        "/auth/login",
        null,
        {
          params: {
            email,
            password,
          },
        }
      );

      login(res.data.access_token, {
        email: email,
      });

      navigate("/");
    } catch (err) {
      console.log(err);

      if (err.response) {
        setError(err.response.data.detail || "Login Failed");
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
            🛰️ SentinelAI Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

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
            onClick={handleLogin}
          >
            Login
          </Button>

          <Button
            fullWidth
            sx={{ mt: 2 }}
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
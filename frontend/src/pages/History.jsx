import { useEffect, useState } from "react";
import API from "../services/api";

import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  CircularProgress,
  Box,
  Chip
} from "@mui/material";

export default function History() {

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await API.get("/history");
      setHistory(res.data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>

      <Typography
        variant="h4"
        fontWeight="bold"
        mb={3}
      >
        Prediction History
      </Typography>

      <TableContainer component={Paper} elevation={5}>

        <Table>

          <TableHead>

            <TableRow>

              <TableCell><b>ID</b></TableCell>
              <TableCell><b>Image</b></TableCell>
              <TableCell><b>Prediction</b></TableCell>
              <TableCell><b>Confidence</b></TableCell>
              <TableCell><b>Date</b></TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {history.map((row) => (

              <TableRow key={row.id}>

                <TableCell>{row.id}</TableCell>

                <TableCell>{row.filename}</TableCell>

                <TableCell>

                  <Chip
                    label={row.prediction}
                    color={
                      row.prediction === "No Threat Detected"
                        ? "success"
                        : "error"
                    }
                  />

                </TableCell>

                <TableCell>
                  {(row.confidence * 100).toFixed(1)}%
                </TableCell>

                <TableCell>
                  {row.created_at}
                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </TableContainer>

    </Box>
  );
}
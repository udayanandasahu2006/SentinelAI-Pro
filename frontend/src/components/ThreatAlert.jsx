import { Card, CardContent, Typography, Chip } from "@mui/material";

export default function ThreatAlert({ prediction, confidence, level }) {

  const getColor = () => {
    switch (level) {
      case "HIGH":
        return "#d32f2f";
      case "MEDIUM":
        return "#ed6c02";
      case "LOW":
        return "#0288d1";
      default:
        return "#2e7d32";
    }
  };

  return (
    <Card
      sx={{
        mt: 3,
        background: "#101820",
        color: "white",
        border: `3px solid ${getColor()}`,
        borderRadius: 3
      }}
    >
      <CardContent>

        <Typography
          variant="h5"
          fontWeight="bold"
          color={getColor()}
        >
          🚨 SENTINEL AI ALERT 🚨
        </Typography>

        <Typography sx={{ mt: 2 }}>
          Object :
          <b> {prediction}</b>
        </Typography>

        <Typography>
          Confidence :
          <b> {(confidence * 100).toFixed(1)}%</b>
        </Typography>

        <Typography sx={{ mt: 1 }}>
          Threat Level
        </Typography>

        <Chip
          label={level}
          sx={{
            mt: 1,
            bgcolor: getColor(),
            color: "white",
            fontWeight: "bold"
          }}
        />

      </CardContent>
    </Card>
  );
}
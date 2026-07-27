import { Container, Typography, Card, CardContent } from "@mui/material";

export default function Settings() {
  return (
    <Container sx={{ mt: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Settings
      </Typography>

      <Card>
        <CardContent>
          <Typography variant="body1">
            SentinelAI Pro Settings will be available here.
          </Typography>
        </CardContent>
      </Card>
    </Container>
  );
}
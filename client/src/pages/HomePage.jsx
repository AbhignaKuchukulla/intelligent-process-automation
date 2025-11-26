import { Container, Typography, Box, Button, Grid, Paper } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SpeedIcon from '@mui/icons-material/Speed';
import SecurityIcon from '@mui/icons-material/Security';

function HomePage() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Intelligent Process Automation
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          AI-driven document processing and workflow automation
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/dashboard"
            sx={{ mr: 2 }}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={RouterLink}
            to="/documents"
          >
            View Documents
          </Button>
        </Box>
      </Box>

      <Grid container spacing={4} sx={{ mt: 4 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <AutoAwesomeIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              AI-Powered OCR
            </Typography>
            <Typography color="text.secondary">
              Extract text from documents with high accuracy using advanced OCR technology
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <SpeedIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Fast Processing
            </Typography>
            <Typography color="text.secondary">
              Process documents in seconds with our optimized pipeline
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
            <SecurityIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Secure & Reliable
            </Typography>
            <Typography color="text.secondary">
              Your data is encrypted and processed securely
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default HomePage;

import { Box, Typography, Grid, Paper } from '@mui/material';
import DocumentUploader from '@/components/DocumentUploader';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Intelligent Process Automation
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Upload Documents
            </Typography>
            <Typography color="text.secondary" paragraph>
              Drag and drop your documents or click to select files. We support PDF, Word, and Image files.
            </Typography>
            <Suspense fallback={<Box>Loading uploader...</Box>}>
              <DocumentUploader />
            </Suspense>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom>
              Key Features
            </Typography>
            <Typography component="ul" sx={{ pl: 2 }}>
              <li>Automated document processing</li>
              <li>Intelligent data extraction</li>
              <li>Workflow automation</li>
              <li>AI-powered analysis</li>
              <li>Real-time collaboration</li>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
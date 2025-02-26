import { useState } from 'react';
import Head from 'next/head';
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { useRouter } from 'next/router';
import DocumentUpload from '../components/DocumentUploader';
import { uploadDocument } from '../services/apiClient';

export default function Home() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<null | { success: boolean; message: string }>(null);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadResult(null);

    try {
      await uploadDocument(file);
      setUploadResult({
        success: true,
        message: `Document "${file.name}" successfully processed!`,
      });
    } catch (error) {
      setUploadResult({
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  return (
    <>
      <Head>
        <title>Intelligent Process Automation</title>
        <meta name="description" content="AI-powered document processing and automation" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box component="main" sx={{ py: 8, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center" justifyContent="center">
            {/* Left Section - Text & Button */}
            <Grid item xs={12} sm={10} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' }, mb: 4 }}>
                <Typography variant="h3" color="primary" gutterBottom>
                  Intelligent Process Automation
                </Typography>
                <Typography variant="h5" color="text.secondary" paragraph>
                  Automate your document workflows with AI-powered solutions.
                </Typography>
                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={goToDashboard}
                  sx={{ mt: 2, fontSize: '1rem', textTransform: 'none' }}
                >
                  Go to Dashboard
                </Button>
              </Box>
            </Grid>

            {/* Right Section - Document Upload */}
            <Grid item xs={12} sm={10} md={6}>
              <Paper elevation={4} sx={{ p: 4, borderRadius: 3, backgroundColor: '#fff' }}>
                <Typography variant="h5" color="primary" gutterBottom>
                  Process a Document
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  Upload a document to extract and process information with AI.
                </Typography>
                <DocumentUpload onUpload={handleFileUpload} isUploading={isUploading} result={uploadResult} />
              </Paper>
            </Grid>
          </Grid>

          {/* How It Works Section */}
          <Grid container spacing={4} sx={{ mt: 6 }} justifyContent="center">
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 5, borderRadius: 3 }}>
                <Typography variant="h5" color="primary" gutterBottom align="center">
                  How It Works
                </Typography>
                <Grid container spacing={3} sx={{ mt: 2 }} justifyContent="center">
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="h6" align="center">1. Upload Documents</Typography>
                    <Typography color="text.secondary" align="center">
                      Upload PDFs, images, forms, and invoices.
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="h6" align="center">2. AI Processing</Typography>
                    <Typography color="text.secondary" align="center">
                      Our AI extracts and categorizes data automatically.
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Typography variant="h6" align="center">3. Automate Workflows</Typography>
                    <Typography color="text.secondary" align="center">
                      Create workflows based on extracted data.
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

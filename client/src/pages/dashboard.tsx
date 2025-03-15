import { useState, useEffect } from 'react';
import Head from 'next/head';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Tab,
  Tabs,
  CircularProgress,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { DocumentScanner, AutoAwesome, Chat } from '@mui/icons-material';

import Navbar from '../components/Navbar'; // Import the Navbar component
import DocumentUpload from '../components/DocumentUploader';
import ActiveWorkflows from '../components/Dashboard/ActiveWorkflows';
import RecentDocuments from '../components/Dashboard/RecentDocuments';
import { fetchDocuments, fetchWorkflows, uploadDocument } from '../services/apiClient';
import ChatInterface from '../components/Chatbot/ChatInterface';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index, ...other }: TabPanelProps) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`dashboard-tabpanel-${index}`}
      aria-labelledby={`dashboard-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  status: string;
  confidence: number;
}

interface Workflow {
  id: string;
  name: string;
  type: string;
  status: string;
  lastRun: string;
  nextRun: string;
}

export default function Dashboard() {
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<null | { success: boolean; message: string }>(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [docsData, workflowsData] = await Promise.all([fetchDocuments(), fetchWorkflows()]);
      console.log('Documents:', docsData);
      console.log('Workflows:', workflowsData);
      setDocuments(docsData || []);
      setWorkflows(workflowsData || []);
    } catch (error) {
      console.error('❌ Failed to load dashboard data:', error);
      setError('Failed to load data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => setTabValue(newValue);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Reset upload result
    setUploadResult(null);

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      setUploadResult({
        success: false,
        message: 'Invalid file type. Please upload a PDF, JPEG, or PNG file.',
      });
      return;
    }

    if (file.size > maxSize) {
      setUploadResult({
        success: false,
        message: 'File size exceeds the limit of 5MB.',
      });
      return;
    }

    setIsUploading(true);

    try {
      await uploadDocument(file);
      setUploadResult({
        success: true,
        message: `Document "${file.name}" successfully processed!`,
      });

      const updatedDocs = await fetchDocuments();
      setDocuments(updatedDocs || []);
    } catch (error) {
      console.error('Upload Document Error:', error);
      setUploadResult({
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard | Intelligent Process Automation</title>
        <meta name="description" content="Manage your automated processes and documents" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>


      <Box component="main" sx={{ py: 4 }}>
        <Container maxWidth="xl">
          <Typography variant="h4" component="h1" gutterBottom>
            Dashboard
          </Typography>

          {error && (
            <Box sx={{ color: 'error.main', textAlign: 'center', my: 2 }}>
              <Typography variant="body1">{error}</Typography>
              <Button variant="contained" onClick={loadData} sx={{ mt: 2 }}>
                Retry
              </Button>
            </Box>
          )}

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Documents Processed</Typography>
                  <Typography variant="h3">{documents.length}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Active Workflows</Typography>
                  <Typography variant="h3">
                    {workflows.filter((w) => w.status.toLowerCase() === 'active').length}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>Success Rate</Typography>
                  <Typography variant="h3">
                    {documents.length > 0
                      ? `${Math.round(
                          (documents.filter((d) => d.status.toLowerCase() === 'processed').length / documents.length
                        ) * 100
                      )}%`
                      : 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Paper sx={{ mb: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs" key="dashboard-tabs">
                <Tab icon={<DocumentScanner aria-label="Documents" />} label="Documents" />
                <Tab icon={<AutoAwesome aria-label="Workflows" />} label="Workflows" />
                <Tab icon={<Chat aria-label="Chat Assistant" />} label="Chat Assistant" />
              </Tabs>
            </Box>

            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }} aria-busy={isLoading}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TabPanel value={tabValue} index={0}>
                  <Box sx={{ mb: 3 }}>
                    <DocumentUpload onUpload={handleFileUpload} isUploading={isUploading} result={uploadResult} />
                  </Box>
                  <RecentDocuments documents={documents} />
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <ActiveWorkflows workflows={workflows} />
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                  <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto', bgcolor: 'background.paper' }}>
                    <Typography variant="h6" gutterBottom>
                      AI Assistant
                    </Typography>
                    <ChatInterface />
                  </Paper>
                </TabPanel>
              </>
            )}
          </Paper>
        </Container>
      </Box>
    </>
  );
}
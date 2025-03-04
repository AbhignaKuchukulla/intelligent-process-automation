import { useState, useEffect } from 'react';
import Head from 'next/head';
import ChatInterface from '../components/Chatbot/ChatInterface';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip
} from '@mui/material';
import { DocumentScanner, AutoAwesome, Chat } from '@mui/icons-material';

import DocumentUpload from '../components/DocumentUploader';
import { fetchDocuments, fetchWorkflows, uploadDocument } from '../services/apiClient';

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

  useEffect(() => {
    let isMounted = true; // ✅ Prevent state update if unmounted
  
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [docsData, workflowsData] = await Promise.all([
          fetchDocuments(),
          fetchWorkflows()
        ]);
  
        if (isMounted) {
          setDocuments(docsData || []);
          setWorkflows(workflowsData || []);
        }
      } catch (error) {
        console.error('❌ Failed to load dashboard data:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
  
    loadData();
  
    return () => {
      isMounted = false; // ✅ Cleanup function
    };
  }, []);
  
  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => setTabValue(newValue);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadResult(null);
    try {
      await uploadDocument(file);
      setUploadResult({
        success: true,
        message: `Document "${file.name}" successfully processed!`
      });
      
      const updatedDocs = await fetchDocuments();
      setDocuments(updatedDocs || []);
    } catch (error) {
      setUploadResult({
        success: false,
        message: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processed':
      case 'active':
      case 'completed':
        return 'success';
      case 'pending':
      case 'scheduled':
        return 'info';
      case 'failed':
        return 'error';
      default:
        return 'default';
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
                    {workflows.filter(w => w.status.toLowerCase() === 'active').length}
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
                        ? `${Math.round((documents.filter(d => d.status.toLowerCase() === 'processed').length / documents.length) * 100)}%`
                        : 'N/A'}                      
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Paper sx={{ mb: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="dashboard tabs">
                <Tab icon={<DocumentScanner />} label="Documents" />
                <Tab icon={<AutoAwesome />} label="Workflows" />
                <Tab icon={<Chat />} label="Chat Assistant" />
              </Tabs>
            </Box>

            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <TabPanel value={tabValue} index={0}>
                  <Box sx={{ mb: 3 }}>
                    <DocumentUpload onUpload={handleFileUpload} isUploading={isUploading} result={uploadResult} />
                  </Box>

                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Date</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Confidence</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {documents.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} align="center">
                              No documents found. Upload your first document to get started.
                            </TableCell>
                          </TableRow>
                        ) : (
                          documents.map((doc) => (
                            <TableRow key={doc.id}>
                              <TableCell>{doc.name}</TableCell>
                              <TableCell>{doc.type}</TableCell>
                              <TableCell>{doc.date}</TableCell>
                              <TableCell>
                                <Chip label={doc.status} color={getStatusColor(doc.status)} size="small" />
                              </TableCell>
                              <TableCell>{doc.confidence}%</TableCell>
                              <TableCell>
                                <Button size="small" variant="outlined">View</Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button variant="contained">Create New Workflow</Button>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Name</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Last Run</TableCell>
                          <TableCell>Next Run</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {workflows.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} align="center">
                              No workflows found. Create your first workflow to get started.
                            </TableCell>
                          </TableRow>
                        ) : (
                          workflows.map((workflow) => (
                            <TableRow key={workflow.id}>
                              <TableCell>{workflow.name}</TableCell>
                              <TableCell>{workflow.type}</TableCell>
                              <TableCell>
                                <Chip label={workflow.status} color={getStatusColor(workflow.status)} size="small" />
                              </TableCell>
                              <TableCell>{workflow.lastRun}</TableCell>
                              <TableCell>{workflow.nextRun}</TableCell>
                              <TableCell>
                                <Button size="small" variant="outlined">Edit</Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                  <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
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

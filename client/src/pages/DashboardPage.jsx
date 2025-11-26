import { useState, useEffect } from 'react';
import { Container, Grid, Paper, Typography, CircularProgress, Box } from '@mui/material';
import DocumentUploader from '../components/DocumentUploader';
import { fetchDocuments, fetchWorkflows } from '../services/api';

function StatsCard({ title, value, description }) {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography color="text.secondary" gutterBottom>
        {title}
      </Typography>
      <Typography variant="h4">{value}</Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {description}
        </Typography>
      )}
    </Paper>
  );
}

function DashboardPage() {
  const [documents, setDocuments] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [docs, wf] = await Promise.all([
        fetchDocuments().catch(() => []),
        fetchWorkflows().catch(() => []),
      ]);
      setDocuments(docs);
      setWorkflows(wf);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Documents Processed"
            value={documents.length}
            description="Total documents"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Active Workflows"
            value={workflows.length}
            description="Running workflows"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Success Rate"
            value="96.5%"
            description="Last 30 days"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatsCard
            title="Processing Time"
            value="1.2s"
            description="Average"
          />
        </Grid>

        <Grid item xs={12}>
          <DocumentUploader onSuccess={loadData} />
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Documents
            </Typography>
            {documents.length === 0 ? (
              <Typography color="text.secondary">
                No documents yet. Upload your first document above.
              </Typography>
            ) : (
              <Typography>
                {documents.length} document{documents.length !== 1 ? 's' : ''} found
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default DashboardPage;

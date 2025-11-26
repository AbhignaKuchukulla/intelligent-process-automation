import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  CircularProgress,
  Box,
  Alert,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import DocumentUploader from '../components/DocumentUploader';
import { fetchDocuments } from '../services/api';

function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadDocuments();
  }, []);

  // Auto-refresh every 5 seconds if there are processing documents
  useEffect(() => {
    const hasProcessing = documents.some(doc => doc.status === 'processing' || doc.status === 'pending');
    
    let interval;
    if (hasProcessing) {
      interval = setInterval(() => {
        loadDocuments();
      }, 5000); // Refresh every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [documents]);

  const loadDocuments = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDocuments();
      setDocuments(data);
    } catch (err) {
      setError(err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'processed':
        return 'success';
      case 'processing':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'info';
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Documents
      </Typography>

      <Box sx={{ mb: 4 }}>
        <DocumentUploader onSuccess={loadDocuments} />
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
          <Button size="small" onClick={loadDocuments} sx={{ ml: 2 }}>
            Retry
          </Button>
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : documents.length === 0 ? (
        <Box textAlign="center" py={4}>
          <DescriptionIcon sx={{ fontSize: 60, color: 'text.secondary' }} />
          <Typography color="text.secondary" sx={{ mt: 2 }}>
            No documents found. Upload your first document above.
          </Typography>
        </Box>
      ) : (
        <>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Showing {documents.length} document{documents.length !== 1 ? 's' : ''}
          </Typography>
          <Grid container spacing={3}>
            {documents.map((doc, index) => (
              <Grid item xs={12} sm={6} md={4} key={doc.id || doc._id || index}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom noWrap>
                      {doc.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Type: {doc.type}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Date: {new Date(doc.date).toLocaleDateString()}
                    </Typography>
                    <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        label={doc.status}
                        color={getStatusColor(doc.status)}
                        size="small"
                      />
                      {(doc.status === 'processing' || doc.status === 'pending') && (
                        <CircularProgress size={16} />
                      )}
                    </Box>
                    {doc.confidence > 0 && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Confidence: {doc.confidence.toFixed(2)}%
                      </Typography>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => navigate(`/documents/${doc.id}`)}>
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button variant="outlined" size="small" onClick={loadDocuments}>
              Refresh
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
}

export default DocumentsPage;

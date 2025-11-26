import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  CircularProgress,
  Box,
  Alert,
  Button,
  Chip,
  TextField,
  Divider,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';
import { fetchDocumentById, reprocessDocument, sendChatMessage } from '../services/api';

function DocumentViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [reprocessing, setReprocessing] = useState(false);

  useEffect(() => {
    if (id) {
      loadDocument();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Auto-refresh for processing documents
  useEffect(() => {
    let interval;
    if (document && document.status === 'processing') {
      interval = setInterval(() => {
        loadDocument();
      }, 3000); // Check every 3 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document?.status]);

  const loadDocument = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDocumentById(id);
      setDocument(data);
    } catch (err) {
      setError(err.message || 'Failed to load document');
    } finally {
      setLoading(false);
    }
  };

  const handleReprocess = async () => {
    setReprocessing(true);
    try {
      await reprocessDocument(id);
      await loadDocument();
    } catch (err) {
      setError(err.message || 'Failed to reprocess document');
    } finally {
      setReprocessing(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setChatLoading(true);

    try {
      const context = document.extractedText || 'No text extracted yet';
      const response = await sendChatMessage(userMessage, context);
      setChatMessages(prev => [...prev, { type: 'bot', text: response.message }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { type: 'bot', text: 'Error: Failed to get response' }]);
    } finally {
      setChatLoading(false);
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={loadDocument}>
          Retry
        </Button>
        <Button onClick={() => navigate('/documents')} sx={{ ml: 2 }}>
          Back to Documents
        </Button>
      </Container>
    );
  }

  if (!document) {
    return (
      <Container maxWidth="md">
        <Alert severity="warning" sx={{ mb: 2 }}>
          Document not found
        </Alert>
        <Button variant="contained" onClick={() => navigate('/documents')}>
          Back to Documents
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/documents')}
        sx={{ mb: 2 }}
      >
        Back to Documents
      </Button>

      <Paper sx={{ p: 4, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" gutterBottom>
            {document.name}
          </Typography>
          {document.status === 'failed' && (
            <Button
              variant="contained"
              color="warning"
              onClick={handleReprocess}
              disabled={reprocessing}
              startIcon={reprocessing ? <CircularProgress size={20} /> : <RefreshIcon />}
            >
              Reprocess
            </Button>
          )}
        </Box>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body1" gutterBottom>
            <strong>Type:</strong> {document.type}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Date:</strong> {new Date(document.date).toLocaleString()}
          </Typography>
          {document.processedAt && (
            <Typography variant="body1" gutterBottom>
              <strong>Processed:</strong> {new Date(document.processedAt).toLocaleString()}
            </Typography>
          )}
          <Box sx={{ mt: 2, mb: 2 }}>
            <strong>Status: </strong>
            <Chip
              label={document.status}
              color={getStatusColor(document.status)}
              size="small"
            />
            {document.status === 'processing' && (
              <CircularProgress size={20} sx={{ ml: 2 }} />
            )}
          </Box>
          {document.confidence > 0 && (
            <Typography variant="body1" gutterBottom>
              <strong>Confidence:</strong> {document.confidence.toFixed(2)}%
            </Typography>
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Extracted Text
        </Typography>
        {document.status === 'processing' ? (
          <Box display="flex" alignItems="center" gap={2}>
            <CircularProgress size={24} />
            <Typography>Processing document...</Typography>
          </Box>
        ) : document.extractedText ? (
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              maxHeight: 400,
              overflow: 'auto',
              bgcolor: '#f5f5f5',
            }}
          >
            <Typography
              variant="body2"
              component="pre"
              sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}
            >
              {document.extractedText}
            </Typography>
          </Paper>
        ) : (
          <Alert severity="info">No text extracted yet</Alert>
        )}
      </Paper>

      {document.extractedText && (
        <Paper sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom>
            Ask Questions About This Document
          </Typography>
          
          <Box
            sx={{
              maxHeight: 300,
              overflow: 'auto',
              mb: 2,
              p: 2,
              bgcolor: '#f5f5f5',
              borderRadius: 1,
            }}
          >
            {chatMessages.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Ask any question about the document content...
              </Typography>
            ) : (
              chatMessages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    mb: 2,
                    p: 2,
                    bgcolor: msg.type === 'user' ? '#e3f2fd' : '#fff',
                    borderRadius: 1,
                    border: '1px solid',
                    borderColor: msg.type === 'user' ? '#2196f3' : '#ccc',
                  }}
                >
                  <Typography variant="caption" fontWeight="bold">
                    {msg.type === 'user' ? 'You' : 'AI Assistant'}
                  </Typography>
                  <Typography variant="body2">{msg.text}</Typography>
                </Box>
              ))
            )}
          </Box>

          <Box display="flex" gap={1}>
            <TextField
              fullWidth
              placeholder="Ask a question..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={chatLoading}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={!chatInput.trim() || chatLoading}
            >
              {chatLoading ? <CircularProgress size={24} /> : <SendIcon />}
            </IconButton>
          </Box>
        </Paper>
      )}
    </Container>
  );
}

export default DocumentViewPage;

"use client";

import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchDocumentById } from '../../../services/apiClient';
import { Box, Typography, CircularProgress, Paper, Alert, Button } from '@mui/material';

interface Document {
  id: string;
  name: string;
  type: string;
  status: string;
  date: string;
  confidence: number;
}

const DocumentViewPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string | undefined;
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const loadDocument = async () => {
        try {
          const doc = await fetchDocumentById(id as string);
          console.log('Document fetched:', doc);
          setDocument(doc);
        } catch (error) {
          console.error('Error fetching document:', error);
          setError('Failed to load document details.');
        } finally {
          setIsLoading(false);
        }
      };

      loadDocument();
    }
  }, [id]);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Alert severity="error">{error}</Alert>
        <Button variant="contained" onClick={() => window.location.reload()} sx={{ mt: 2 }}>
          Retry
        </Button>
      </Box>
    );
  }

  if (!document) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <Alert severity="warning">Document not found.</Alert>
        <Button variant="contained" onClick={() => router.push('/documents')} sx={{ mt: 2 }}>
          Back to Documents
        </Button>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          {document.name}
        </Typography>
        <Typography variant="body1">Type: {document.type}</Typography>
        <Typography variant="body1">Status: {document.status}</Typography>
        <Typography variant="body1">Date: {document.date}</Typography>
        <Typography variant="body1">Confidence: {document.confidence}%</Typography>
      </Paper>
    </Box>
  );
};

export default DocumentViewPage;
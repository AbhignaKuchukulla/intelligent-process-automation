'use client';

import { useCallback } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { DocumentGridSkeleton } from '@/components/LoadingFallback';
import DocumentUploader from '@/components/DocumentUploader';
import { useDocuments } from '@/hooks/useApi';
import { Document } from '@/types';

function DocumentListingContent() {
  const { data: documents, error, isLoading, execute: refreshDocuments } = useDocuments();

  const handleDocumentUploaded = useCallback(() => {
    refreshDocuments();
  }, [refreshDocuments]);

  if (error) {
    throw error; // ErrorBoundary will catch this
  }

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <DocumentUploader onSuccess={handleDocumentUploaded} />
      </Box>

      <Typography variant="h5" gutterBottom>
        Recent Documents
      </Typography>

      {isLoading ? (
        <DocumentGridSkeleton />
      ) : documents?.length ? (
        <Grid container spacing={3}>
          {documents.map((doc) => (
            <Grid item xs={12} sm={6} md={4} key={doc.id}>
              <DocumentCard document={doc} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
          No documents found. Upload your first document to get started.
        </Typography>
      )}
    </>
  );
}

interface DocumentCardProps {
  document: Document;
}

function DocumentCard({ document }: DocumentCardProps) {
  return (
    <Box
      sx={{
        p: 2,
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        bgcolor: 'background.paper',
      }}
    >
      <Typography variant="subtitle1" gutterBottom>
        {document.name}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Type: {document.type}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Status: {document.status}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Uploaded: {new Date(document.date).toLocaleDateString()}
      </Typography>
      {document.confidence && (
        <Typography variant="body2" color="text.secondary">
          Confidence: {document.confidence.toFixed(2)}%
        </Typography>
      )}
    </Box>
  );
}

export default function DocumentListing() {
  return (
    <ErrorBoundary>
      <DocumentListingContent />
    </ErrorBoundary>
  );
}
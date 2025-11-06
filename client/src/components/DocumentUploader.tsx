'use client';

import { useState, useRef, useCallback } from 'react';
import { Box, Button, Typography, Paper, CircularProgress } from '@mui/material';
import { useUploadDocument } from '@/hooks/useApi';
import { notify } from '@/utils/notifier';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = new Set([
  'application/pdf',
  'image/jpeg',
  'image/png',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

interface Props {
  onSuccess?: () => void;
  // Legacy props (some pages still use the old API). If `onUpload` is
  // provided we will call it instead of the internal upload handler so
  // older pages can continue to manage upload state.
  onUpload?: (file: File) => Promise<void>;
  // Optional externally-managed uploading state. If provided this will
  // be used in preference to the internal `isLoading` from the hook.
  isUploading?: boolean;
  // Optional result object used by legacy pages to display upload results.
  result?: { success: boolean; message: string } | null;
}

export default function DocumentUploader({ onSuccess, onUpload, isUploading: propsIsUploading, result: propsResult }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { execute: uploadDocument, isLoading: internalLoading } = useUploadDocument();
  const isLoading = typeof propsIsUploading !== 'undefined' ? propsIsUploading : internalLoading;

  const formatFileSize = (size: number) => `${(size / 1024).toFixed(2)} KB`;

  const validateFile = useCallback((selectedFile: File) => {
    if (!ALLOWED_TYPES.has(selectedFile.type)) {
      setError('Unsupported file type. Allowed: PDF, JPG, PNG, DOC, DOCX.');
      return false;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      setError('File size exceeds 10MB limit.');
      return false;
    }
    setError(null);
    return true;
  }, []);

  const handleFileSelect = useCallback((selectedFile: File) => {
    if (validateFile(selectedFile)) setFile(selectedFile);
  }, [validateFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFileSelect(f);
  }, [handleFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFileSelect(f);
  }, [handleFileSelect]);

  const handleUpload = useCallback(async () => {
    if (!file) return;
    try {
      if (onUpload) {
        // Call legacy handler the page provided and let it manage state.
        await onUpload(file);
      } else {
        await uploadDocument(file);
      }

      notify({ message: 'Document uploaded and processing started.', severity: 'success' });
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onSuccess?.();
    } catch (err: any) {
      console.error('Upload failed:', err);
      notify({ message: err?.message || 'Upload failed', severity: 'error' });
    }
  }, [file, uploadDocument, onSuccess, onUpload]);

  return (
    <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        Upload Your Document
      </Typography>

      <Box
        sx={{
          border: '2px dashed',
          borderColor: 'primary.main',
          p: 3,
          borderRadius: 2,
          backgroundColor: 'background.default',
          cursor: isLoading ? 'not-allowed' : 'pointer',
        }}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          hidden
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          disabled={isLoading}
        />

        <Typography variant="body1" color="text.secondary">
          {file ? `${file.name} (${formatFileSize(file.size)})` : 'Drag & drop or click to select a file'}
        </Typography>
        {propsResult && (
          <Typography variant="body2" color={propsResult.success ? 'success.main' : 'error.main'} sx={{ mt: 1 }}>
            {propsResult.message}
          </Typography>
        )}
      </Box>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        file && (
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleUpload}>
            Upload & Process
          </Button>
        )
      )}
    </Paper>
  );
}
 
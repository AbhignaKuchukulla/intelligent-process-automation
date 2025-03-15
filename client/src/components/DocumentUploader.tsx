import React, { useState, useRef } from 'react';
import { Box, Button, Typography, CircularProgress, Paper } from '@mui/material';

interface DocumentUploaderProps {
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
  result: { success: boolean; message: string } | null;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onUpload, isUploading, result }) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (size: number) => `${(size / 1024).toFixed(2)} KB`;

  const validateFile = (selectedFile: File) => {
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('❌ Unsupported file type. Allowed: PDF, JPG, PNG, DOC, DOCX.');
      return false;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('❌ File size exceeds 10MB limit.');
      return false;
    }
    setError(null);
    return true;
  };

  const handleFileSelect = (selectedFile: File) => {
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) handleFileSelect(event.target.files[0]);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files?.[0]) handleFileSelect(event.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (file) {
      try {
        await onUpload(file);
        setFile(null); // Reset file after successful upload
        if (fileInputRef.current) fileInputRef.current.value = ''; // Clear file input
      } catch (error) {
        console.error('Upload failed:', error);
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        📁 Upload Your Document
      </Typography>

      <Box
        sx={{
          border: '2px dashed #1976d2',
          padding: '20px',
          borderRadius: '10px',
          backgroundColor: '#f4f6f8',
          '&:hover': { backgroundColor: '#e3f2fd' },
          cursor: 'pointer',
        }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          hidden
          onChange={handleFileChange}
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          disabled={isUploading}
        />
        <Typography variant="body1" color="textSecondary">
          {file ? `${file.name} (${formatFileSize(file.size)})` : '📂 Drag & Drop or Click to Upload'}
        </Typography>
      </Box>

      {error && (
        <Typography sx={{ mt: 2, color: 'red', fontWeight: 'bold' }}>{error}</Typography>
      )}

      {isUploading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {result && (
        <Typography
          sx={{
            mt: 2,
            p: 1,
            color: result.success ? 'green' : 'red',
            backgroundColor: result.success ? '#e8f5e9' : '#ffebee',
            borderRadius: '5px',
          }}
        >
          {result.message}
        </Typography>
      )}

      {file && !isUploading && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleUpload}
          disabled={isUploading}
        >
          🚀 Process Document
        </Button>
      )}
    </Paper>
  );
};

export default DocumentUploader;
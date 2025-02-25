import React, { useState, useRef } from 'react';
import { Box, Button, Typography, CircularProgress, Paper } from '@mui/material';

interface DocumentUploaderProps {
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
  result: { success: boolean; message: string } | null;
}

const DocumentUploader: React.FC<DocumentUploaderProps> = ({ onUpload, isUploading, result }) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);
      onUpload(selectedFile);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      const droppedFile = event.dataTransfer.files[0];
      setFile(droppedFile);
      onUpload(droppedFile);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>
        Upload Your Document
      </Typography>

      <Box
        sx={{
          border: '2px dashed #1976d2',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: '#f4f6f8',
          '&:hover': { backgroundColor: '#e3f2fd' },
        }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
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
          {file ? file.name : 'Drag & Drop or Click to Upload'}
        </Typography>
      </Box>

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
          onClick={() => onUpload(file)}
          disabled={isUploading}
        >
          Process Document
        </Button>
      )}
    </Paper>
  );
};

export default DocumentUploader;

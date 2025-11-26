import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { uploadDocument } from '../services/api';

function DocumentUploader({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
    setError(null);
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      await uploadDocument(file);
      setSuccess(true);
      setFile(null);
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Upload Document
        </Typography>

        <Box sx={{ mt: 2 }}>
          <input
            type="file"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="file-input"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <label htmlFor="file-input">
            <Button
              variant="outlined"
              component="span"
              startIcon={<CloudUploadIcon />}
              disabled={uploading}
            >
              Choose File
            </Button>
          </label>

          {file && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              Selected: {file.name}
            </Typography>
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Document uploaded successfully!
          </Alert>
        )}

        {uploading && <LinearProgress sx={{ mt: 2 }} />}

        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={!file || uploading}
          sx={{ mt: 2 }}
        >
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </CardContent>
    </Card>
  );
}

DocumentUploader.propTypes = {
  onSuccess: PropTypes.func,
};

export default DocumentUploader;

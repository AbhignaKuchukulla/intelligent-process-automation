import { useState } from 'react';
import axios from 'axios';

export default function DocumentUploader() {
  const [file, setFile] = useState<File | null>(null); // Ensure proper typing

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file.');
    }
  };

  return (
    <div className="p-5 border rounded shadow-md">
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile} className="bg-green-500 p-2 text-white mt-2">
        Upload
      </button>
    </div>
  );
}

import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      // local file URL
      const url = URL.createObjectURL(selectedFile);
      setPreviewURL(url);
      console.log('File URL:', url);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <TextField
        type="file"
        onChange={handleFileChange}
      />
      {previewURL && (
        <Box mt={2}>
          <a href={previewURL} target="_blank" rel="noopener noreferrer">
            <Button variant="contained">View Uploaded Image</Button>
          </a>
          <div>{previewURL}</div>
        </Box>
      )}
    </Box>
  );
}

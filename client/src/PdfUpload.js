import React, { useState } from 'react';
import axios from 'axios';

function PdfUploadBox({ setExplanation, setLoading }) {
  const [fileName, setFileName] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    setLoading(true);
    setExplanation('');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await axios.post('http://localhost:5050/api/upload-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setExplanation(res.data.explanation);
    } catch (err) {
      console.error('❌ Upload failed:', err);
      setExplanation('Error: Failed to analyze PDF.');
    }

    setLoading(false);
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <label htmlFor="pdfUpload" style={{ cursor: 'pointer', color: '#007bff' }}>
        📎 Upload PDF
      </label>
      <input
        id="pdfUpload"
        type="file"
        accept=".pdf"
        onChange={handleUpload}
        style={{ display: 'none' }}
      />
      {fileName && <p>📄 {fileName}</p>}
    </div>
  );
}

export default PdfUploadBox;

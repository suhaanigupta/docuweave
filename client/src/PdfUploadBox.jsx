import React, { useRef, useState } from 'react';
import axios from 'axios';

function PdfUploadBox({ setExplanation, setLoading }) {
  const [fileName, setFileName] = useState(null);
  const fileInputRef = useRef(null);

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

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <p><strong>📄 Or upload a contract PDF</strong></p>

      <button
        onClick={triggerFileSelect}
        style={{
          padding: '8px 12px',
          backgroundColor: 'transparent',
          border: 'none',
          color: '#007bff',
          textDecoration: 'underline',
          cursor: 'pointer',
        }}
      >
        📎 Upload PDF
      </button>

      <input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        onChange={handleUpload}
        style={{ display: 'none' }}
      />

      {fileName && <p>✅ Uploaded: {fileName}</p>}
    </div>
  );
}

export default PdfUploadBox;

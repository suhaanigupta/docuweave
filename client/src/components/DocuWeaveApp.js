// src/components/DocuWeaveApp.js
import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';
import { FaCloudUploadAlt, FaMoon, FaSun } from 'react-icons/fa';

function DocuWeaveApp({ user, onLogout }) {
  const [file, setFile] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handlePDFUpload = async () => {
    if (!file) return;
    setLoading(true);
    setExplanation(null);

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await axios.post('http://localhost:5050/api/upload-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setExplanation(res.data);
    } catch (err) {
      console.error('❌ Upload failed', err);
      setExplanation({ error: 'Could not process PDF' });
    }

    setLoading(false);
  };

  return (
    <div className={`app-container ${darkMode ? 'dark' : ''}`}>
      <header>
        <h1>🧾 DocuWeave</h1>
        <div>
          <span style={{ marginRight: '1rem' }}>Welcome, {user.email}</span>
          <button className="toggle-btn" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button className="toggle-btn" style={{ marginLeft: '1rem' }} onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <main>
        <section className="upload-box">
          <FaCloudUploadAlt size={60} />
          <p>Drag and drop your PDF here or click to select a file</p>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
          />
          {file && <p className="filename">📄 {file.name}</p>}
          <p className="note">Only PDF files allowed. Max size: 10MB.</p>
          <button onClick={handlePDFUpload} disabled={!file || loading}>
            {loading ? 'Uploading...' : 'Upload PDF'}
          </button>
        </section>

        <section className="result-section">
          {loading && <p className="loading-text">⏳ Processing your document...</p>}
          {explanation &&
            Array.isArray(explanation) &&
            explanation.map((item, idx) => (
              <div key={idx} className="clause-box">
                <h3>📜 Clause {idx + 1}</h3>
                <p><strong>Clause:</strong> {item.clause}</p>
                <p><strong>Explanation:</strong> {item.explanation}</p>
                {item.risks?.length > 0 && (
                  <ul>
                    <strong>⚠️ Risks:</strong>
                    {item.risks.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                )}
                {item.suggestions?.length > 0 && (
                  <ul>
                    <strong>✅ Suggestions:</strong>
                    {item.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                )}
              </div>
            ))}
        </section>

        <section className="how-to-use">
          <h2>🚀 How to Use DocuWeave</h2>
          <ul>
            <li>1. Upload any legal PDF contract using the drag/drop box above.</li>
            <li>2. We’ll extract and analyze each clause using AI.</li>
            <li>3. You’ll receive clause explanations, risks, and improvement suggestions.</li>
          </ul>
        </section>

        <section className="advantages">
          <h2>✨ Why Choose DocuWeave?</h2>
          <div className="advantage-grid">
            <div className="adv-box">
              <h4>🧠 AI-Powered Insights</h4>
              <p>Understand legal jargon with smart explanations and risk detection.</p>
            </div>
            <div className="adv-box">
              <h4>⚖️ Clause-by-Clause Analysis</h4>
              <p>Analyze individual clauses for clearer legal understanding.</p>
            </div>
            <div className="adv-box">
              <h4>📄 Upload PDFs Easily</h4>
              <p>Just drag and drop your legal PDFs—no setup required.</p>
            </div>
            <div className="adv-box">
              <h4>🔒 Secure & Private</h4>
              <p>Your documents are processed safely and never stored.</p>
            </div>
            <div className="adv-box">
              <h4>🌙 Dark Mode Support</h4>
              <p>Enjoy an elegant, eye-friendly UI with dark/light theme options.</p>
            </div>
            <div className="adv-box">
              <h4>📱 Mobile Friendly</h4>
              <p>Responsive layout works seamlessly on desktops and phones.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DocuWeaveApp;
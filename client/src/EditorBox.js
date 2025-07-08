import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import axios from 'axios';
import { useState } from 'react';

function EditorBox({ setExplanation, setLoading }) {
  const [pdfName, setPdfName] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: '✍️ Type your contract clause here...',
      }),
    ],
    content: '',
  });

  const handleExplain = async () => {
    if (!editor) return;

    const clause = editor.getText();
    setLoading(true);
    setExplanation('');

    try {
      const res = await axios.post('http://localhost:5050/api/explain', {
        clause,
      });
      setExplanation(res.data.explanation);
    } catch (err) {
      console.error('❌ Error calling backend:', err);
      setExplanation('Error: Could not get explanation.');
    }

    setLoading(false);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setPdfName(file.name);
    setLoading(true);
    setExplanation('');

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const res = await axios.post('http://localhost:5050/api/upload-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setExplanation(res.data.explanation);
    } catch (err) {
      console.error('❌ Error uploading PDF:', err);
      setExplanation('Error: Could not analyze PDF.');
    }

    setLoading(false);
  };

  return (
    <div>
      <EditorContent editor={editor} className="tiptap" />

      <button onClick={handleExplain} disabled={!editor}>
        Explain Clause
      </button>

      <hr style={{ margin: '30px 0' }} />

      <h3>📄 Or upload a contract PDF</h3>
      <input type="file" accept="application/pdf" onChange={handleFileUpload} />
      {pdfName && <p style={{ fontStyle: 'italic' }}>Uploaded: {pdfName}</p>}
    </div>
  );
}

export default EditorBox;

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import axios from 'axios';

function Editor({ setExplanation, setLoading }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Type your contract clause here...</p>',
  });

  const handleExplain = async () => {
    const clause = editor?.getText();
    if (!clause) return;

    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/explain', {
        clause,
      });
      setExplanation(res.data.explanation);
    } catch (err) {
      setExplanation('Error: Could not get explanation.');
    }
    setLoading(false);
  };

  return (
    <div>
      {editor ? (
        <>
          <EditorContent editor={editor} />
          <button onClick={handleExplain}>Explain Clause</button>
        </>
      ) : (
        <p>Loading editor...</p>
      )}
    </div>
  );
}

export default Editor;

import { useState } from 'react';

function App() {
  const [notes, setNotes] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // FIX: API Key is no longer read or used in the frontend. 
  // It has been moved to the backend to prevent exposure.

  const handleSummarize = async () => {
    if (!notes.trim()) return;
    
    setLoading(true);
    setError(null);
    setSummary('');

    try {
      // FIX: Calling our secure backend proxy instead of api.openai.com directly.
      // This hides the API key from the browser's Network tab.
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to summarize notes');
      }

      // Read from the data structure returned by our backend proxy
      setSummary(data.data.summary);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px', fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>Study Note Summariser</h1>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <textarea
          placeholder="Paste your long study notes here..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          style={{
            height: '200px',
            padding: '15px',
            borderRadius: '12px',
            border: '1px solid #ddd',
            fontSize: '16px',
            resize: 'vertical'
          }}
        />
        
        <button
          onClick={handleSummarize}
          disabled={loading || !notes.trim()}
          style={{
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#007bff',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Summarising...' : 'Summarise Notes'}
        </button>
      </div>

      {error && (
        <div style={{
          marginTop: '20px',
          padding: '12px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '8px',
          border: '1px solid #ef9a9a'
        }}>
          {error}
        </div>
      )}

      {summary && (
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e9ecef',
          lineHeight: '1.6'
        }}>
          <h2 style={{ marginTop: 0, fontSize: '18px' }}>Summary</h2>
          <div style={{ whiteSpace: 'pre-wrap' }}>{summary}</div>
        </div>
      )}
    </div>
  );
}

export default App;

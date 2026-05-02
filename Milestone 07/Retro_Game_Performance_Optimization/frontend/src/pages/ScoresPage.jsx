import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ScoreList from '../components/ScoreList';
import { Trophy, Gamepad2 } from 'lucide-react';

const ScoresPage = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  // FIX 4: Fixed Double Fetch with AbortController
  useEffect(() => {
    const controller = new AbortController();

    const fetchScores = async () => {
      setLoading(true);
      try {
        // Passing the abort signal to axios to prevent overlapping requests
        const res = await axios.get('http://localhost:3001/api/scores?page=1&limit=20', {
          signal: controller.signal
        });
        setScores(res.data.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          console.error('Fetch error:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchScores();

    // Cleanup: Abort request if component unmounts or re-renders
    return () => controller.abort();
  }, []); // Proper empty dependency array

  // FIX 6: Memoized callback for deleting scores
  const handleDelete = useCallback((id) => {
    setScores(prev => prev.filter(s => s.id !== id));
  }, []);

  return (
    <div className="app-container">
      <header className="main-header">
        <div className="content-wrapper header-inner">
          <div className="title-group">
            <div className="version-tag">
              <Gamepad2 size={16} className="animate-pulse" />
              <span>Mainframe Link Active</span>
            </div>
            <h1 className="main-title">ARCADE HEROES</h1>
          </div>
          
          <div className="stats-card">
            <div className="stats-icon-box">
              <Trophy size={32} color="var(--accent-cyan)" />
            </div>
            <div>
              <div className="stats-label">Global Leaderboard</div>
              <div className="stats-value">{scores.length} Entries</div>
            </div>
          </div>
        </div>
      </header>

      <main className="content-wrapper">
        {loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">RECOVERING_DATA_STREAM...</p>
          </div>
        ) : (
          <ScoreList scores={scores} onDelete={handleDelete} />
        )}
      </main>
    </div>
  );
};

export default ScoresPage;

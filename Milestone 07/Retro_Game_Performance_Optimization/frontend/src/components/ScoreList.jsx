import React, { useState, useMemo } from 'react';
import ScoreCard from './ScoreCard';
import { Search } from 'lucide-react';

const ScoreList = ({ scores, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // FIX 5: Expensive Render Computation – using useMemo to cache filtered results
  // Only re-computes if scores or searchTerm changes
  const filteredScores = useMemo(() => {
    console.log('--- Filtering Scores (useMemo) ---');
    return scores.filter(s => 
      s.game.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.player.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [scores, searchTerm]);

  return (
    <div className="list-wrapper">
      <div className="search-container">
        <div className="search-field-wrapper">
          <Search size={20} color="var(--accent-cyan)" />
          <input
            type="text"
            placeholder="Search game, player, or score..."
            className="premium-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="score-grid">
        {filteredScores.map(score => (
          <ScoreCard key={score.id} score={score} onDelete={onDelete} />
        ))}
      </div>
      
      {filteredScores.length === 0 && (
        <div className="no-results">
          <div className="no-results-code">RESULT_NOT_FOUND</div>
          <p className="no-results-text">No matches found in the arcade mainframe.</p>
        </div>
      )}
    </div>
  );
};

export default ScoreList;

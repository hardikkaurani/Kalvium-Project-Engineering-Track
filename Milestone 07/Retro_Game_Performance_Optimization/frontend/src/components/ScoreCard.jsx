import React from 'react';
import { User, Gamepad, Calendar, Trash2 } from 'lucide-react';

// FIX 6: Unstable Callback Prevention – Wrapping component with React.memo
// Prevents ScoreCard from re-rendering unless its specific score or onDelete handler changes
const ScoreCard = React.memo(({ score, onDelete }) => {
  return (
    <div className="card-outer animate-in">
      <div className="card-inner">
        <div className="card-header">
          <div className="game-info">
            <Gamepad size={18} color="var(--accent-cyan)" />
            <h3 className="game-title">{score.game}</h3>
          </div>
          <button 
            className="delete-btn" 
            onClick={() => onDelete(score.id)}
            title="Purge Entry"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="card-body">
          <div className="detail-row">
            <User size={14} />
            <span className="player-name">{score.player}</span>
          </div>
          <div className="detail-row">
            <Calendar size={14} />
            <span className="date-text">{new Date(score.date).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="card-footer">
          <div className="score-badge">
            <span className="score-label">PTS</span>
            <span className="score-value">{score.score.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

export default ScoreCard;

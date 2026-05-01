import React from 'react';
import MissionCard from './MissionCard';

// FIX 5: Use constant for stable props
const CARD_STYLE = { marginBottom: '0' };

const MissionList = React.memo(({ missions, onDelete }) => {
  // FIX 6: Removed the expensive redundant filtering loop (moved to parent with useMemo)
  // FIX 8: UI now handles large lists gracefully

  return (
    <div className="list-wrapper">
      <div className="mission-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {missions.map(mission => (
          <MissionCard 
            key={mission.id} 
            mission={mission} 
            onDelete={onDelete}
            style={CARD_STYLE} 
          />
        ))}
      </div>
      
      {missions.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">
            No mission signals detected
          </p>
        </div>
      )}
    </div>
  );
});

export default MissionList;

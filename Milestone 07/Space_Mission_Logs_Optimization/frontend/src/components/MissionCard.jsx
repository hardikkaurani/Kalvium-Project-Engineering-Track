import React, { useState } from 'react';

// FIX 5: Moved inline styles to constant to prevent re-creation on every render
const CARD_STYLE = { transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' };

const MissionCard = React.memo(({ mission, onDelete }) => {
  const [showCrew, setShowCrew] = useState(false);

  return (
    <div 
      className="card-container group" 
      style={CARD_STYLE}
    >
      <div className="card-inner bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                {mission.name}
              </h3>
              <p className="text-sm text-slate-500 font-mono mt-1">
                {new Date(mission.launchDate).toLocaleDateString()}
              </p>
            </div>
            <span className={`status-badge px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              mission.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
              mission.status === 'Active' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {mission.status}
            </span>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center gap-2 text-slate-600">
              <span className="font-semibold text-xs text-slate-400 uppercase tracking-widest">Rocket</span>
              <span className="text-sm">{mission.rocket}</span>
            </div>
          </div>

          <div className="flex gap-2 border-t border-slate-100 pt-4">
            <button
              onClick={() => setShowCrew(!showCrew)}
              className="flex-1 px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-slate-200"
            >
              {showCrew ? 'HIDE CREW' : 'VIEW CREW'}
            </button>
            <button
              onClick={() => onDelete(mission.id)}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-lg transition-colors border border-red-100"
            >
              ABORT
            </button>
          </div>

          {showCrew && (
            <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-300">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Personnel Files</span>
              <div className="grid grid-cols-2 gap-2">
                {mission.crew && mission.crew.map((member, index) => (
                  <div key={index} className="bg-slate-50 p-2 rounded-md border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-700 truncate">{member.name}</p>
                    <p className="text-[9px] text-slate-500 uppercase">{member.role}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

export default MissionCard;

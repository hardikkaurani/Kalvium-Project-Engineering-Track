import React from 'react';

/**
 * Empty state with icon, title, description, and optional CTA.
 * @param {{ title: string, message: string, actionLabel?: string, onAction?: function }} props
 */
function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 animate-fade-in">
      {/* Empty Illustration */}
      <div className="w-16 h-16 rounded-2xl bg-gray-700/30 border border-gray-600/30 flex items-center justify-center mb-5">
        <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
        </svg>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-white mb-2">{title || 'No data found'}</h3>

      {/* Description */}
      <p className="text-gray-400 text-sm text-center max-w-md mb-6 leading-relaxed">
        
      </p>

      {/* CTA Button (only if both actionLabel and onAction are provided) */}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-500/10 hover:bg-violet-500/20 border border-violet-500/30 text-violet-400 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;

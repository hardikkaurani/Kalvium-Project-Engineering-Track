import React from 'react';

/**
 * Skeleton loading cards with shimmer animation.
 * @param {{ count: number }} props
 */
function SkeletonCard({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5 space-y-4"
        >
          {/* Header row: icon + title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded-lg bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-shimmer" />
              <div className="h-3 w-1/2 rounded-lg bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-shimmer" />
            </div>
          </div>

          {/* Content lines */}
          <div className="space-y-2 pt-2">
            <div className="h-3 w-full rounded-lg bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-shimmer" />
            <div className="h-3 w-5/6 rounded-lg bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-shimmer" />
          </div>

          {/* Footer row */}
          <div className="flex justify-between items-center pt-2">
            <div className="h-6 w-20 rounded-full bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-shimmer" />
            <div className="h-4 w-16 rounded-lg bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 bg-[length:200%_100%] animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkeletonCard;

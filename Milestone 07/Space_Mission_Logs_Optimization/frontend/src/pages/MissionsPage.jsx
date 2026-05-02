import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import MissionList from '../components/MissionList';

const MissionsPage = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // FIX 7: Fixed Double Fetch with AbortController and proper dependency array
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchMissions = async () => {
      try {
        setLoading(true);
        // Using the new paginated API endpoint
        const response = await axios.get(`http://localhost:3001/api/missions?page=${page}&limit=12`, {
          signal: controller.signal
        });
        
        const { data, metadata } = response.data;
        
        if (page === 1) {
          setMissions(data);
        } else {
          setMissions(prev => [...prev, ...data]);
        }
        
        setHasMore(metadata.hasNextPage);
        setLoading(false);
      } catch (error) {
        if (!axios.isCancel(error)) {
          console.error('Error fetching missions:', error);
          setLoading(false);
        }
      }
    };

    fetchMissions();

    // Cleanup function to abort request on unmount or re-run
    return () => controller.abort();
  }, [page]); // Proper dependencies

  // FIX 6: Memoized expensive computation (filtering)
  const filteredMissions = useMemo(() => {
    console.log('--- Filtering Missions (useMemo) ---');
    return missions.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.rocket.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [missions, searchTerm]);

  // FIX 9: Memoized callback to prevent re-renders of children
  const handleDelete = useCallback((id) => {
    setMissions(prev => prev.filter(m => m.id !== id));
  }, []);

  // FIX 8: "Load More" to reduce initial DOM load
  const loadMore = useCallback(() => {
    setPage(prev => prev + 1);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Space Mission Logs
          </h1>
          <p className="text-lg text-slate-600">
            Real-time telemetry and optimized mission catalog
          </p>
          
          <div className="mt-8 max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search by mission or rocket..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </header>

        <MissionList 
          missions={filteredMissions} 
          onDelete={handleDelete} 
        />

        {hasMore && (
          <div className="mt-12 text-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
            >
              {loading ? 'SYNCING DATA...' : 'LOAD MORE MISSIONS'}
            </button>
          </div>
        )}

        {!hasMore && missions.length > 0 && (
          <p className="mt-12 text-center text-slate-400 font-medium">
            End of mission catalog reached.
          </p>
        )}
      </div>
    </div>
  );
};

export default MissionsPage;

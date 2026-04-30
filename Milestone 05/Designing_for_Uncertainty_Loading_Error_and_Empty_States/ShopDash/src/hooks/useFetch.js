import { useState, useEffect, useCallback } from 'react';

/**
 * Generic data-fetching hook with loading, error, and data states.
 *
 * @param {Function} fetchFn - Async function that returns data
 * @param {Object} options - Options to pass to fetchFn (e.g. { fail: true })
 * @returns {{ data, isLoading, error, refetch }}
 */
export function useFetch(fetchFn, options = {}) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await fetchFn(options);
      setData(result);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, JSON.stringify(options)]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

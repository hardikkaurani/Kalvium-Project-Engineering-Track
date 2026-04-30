import React from 'react';
import { useFetch } from '../hooks/useFetch';
import { fetchCustomers } from '../services/api';
import { SkeletonCard, ErrorMessage, EmptyState } from '../components/states';

function Customers() {
  const { data: customers, isLoading, error, refetch } = useFetch(fetchCustomers);

  // 4-STATE PATTERN: Loading → Error → Empty → Data

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">Customers</h1>
        <SkeletonCard count={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">Customers</h1>
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  if (!customers || customers.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">Customers</h1>
        <EmptyState
          title="No customers yet"
          message="Your customer base will grow here as people shop."
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">Customers</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5 hover:border-violet-500/30 transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-sm font-bold text-violet-400">
                {customer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{customer.name}</p>
                <p className="text-gray-500 text-xs truncate">{customer.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-700/50">
              <div>
                <p className="text-gray-500 text-xs">Orders</p>
                <p className="text-white font-semibold">{customer.orders}</p>
              </div>
              <div>
                <p className="text-gray-500 text-xs">Total Spent</p>
                <p className="text-emerald-400 font-semibold">${customer.spent.toLocaleString()}</p>
              </div>
            </div>

            <p className="text-gray-600 text-xs mt-3">Joined {customer.joined}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Customers;

import React from 'react';
import { useFetch } from '../hooks/useFetch';
import { fetchOrders } from '../services/api';
import { SkeletonCard, ErrorMessage, EmptyState } from '../components/states';

const STATUS_COLORS = {
  Delivered: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Processing: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  Shipped: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
};

function Orders() {
  const { data: orders, isLoading, error, refetch } = useFetch(fetchOrders);

  // 4-STATE PATTERN: Loading → Error → Empty → Data

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">Orders</h1>
        <SkeletonCard count={6} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">Orders</h1>
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">Orders</h1>
        <EmptyState
          title="No orders yet"
          message="When customers place orders, they'll appear here."
          actionLabel="Refresh"
          onAction={refetch}
        />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">Orders</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5 hover:border-violet-500/30 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-mono text-violet-400">{order.id}</span>
              <span className={`text-xs px-2.5 py-1 rounded-full border ${STATUS_COLORS[order.status] || ''}`}>
                {order.status}
              </span>
            </div>

            <p className="text-white font-medium mb-1">{order.customer}</p>
            <p className="text-gray-500 text-sm mb-3">{order.date}</p>

            <div className="flex justify-between items-center pt-3 border-t border-gray-700/50">
              <span className="text-lg font-bold text-emerald-400">${order.total.toFixed(2)}</span>
              <button className="text-xs text-gray-400 hover:text-white transition-colors">
                View Details →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;

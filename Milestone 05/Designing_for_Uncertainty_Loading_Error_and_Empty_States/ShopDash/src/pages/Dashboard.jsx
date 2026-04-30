import React from 'react';
import { useFetch } from '../hooks/useFetch';
import { fetchDashboard } from '../services/api';
import { SkeletonCard, ErrorMessage, EmptyState } from '../components/states';

function Dashboard() {
  const { data: stats, isLoading, error, refetch } = useFetch(fetchDashboard);

  // 4-STATE PATTERN: Loading → Error → Empty → Data

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
        <SkeletonCard count={4} />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
        <ErrorMessage message={error} onRetry={refetch} />
      </div>
    );
  }

  if (!stats || (stats.orders === 0 && stats.revenue === 0)) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
        <EmptyState
          title="No dashboard data"
          message="Start processing orders to see your analytics here."
          actionLabel="Refresh"
          onAction={refetch}
        />
      </div>
    );
  }

  const statCards = [
    { label: 'Revenue', value: `$${stats.revenue.toLocaleString()}`, icon: '💰', color: 'emerald' },
    { label: 'Orders', value: stats.orders, icon: '📦', color: 'violet' },
    { label: 'Customers', value: stats.customers, icon: '👥', color: 'blue' },
    { label: 'Products', value: stats.products, icon: '🏷️', color: 'amber' },
  ];

  const colorMap = {
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    violet: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5 hover:border-violet-500/30 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm font-medium">{stat.label}</span>
              <span className={`w-9 h-9 rounded-xl border flex items-center justify-center text-base ${colorMap[stat.color]}`}>
                {stat.icon}
              </span>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-700/30 last:border-0">
                <div>
                  <p className="text-white text-sm font-medium">{order.customer}</p>
                  <p className="text-gray-500 text-xs font-mono">{order.id}</p>
                </div>
                <span className="text-emerald-400 font-semibold text-sm">${order.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-white mb-4">Top Products</h2>
          <div className="space-y-3">
            {stats.topProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between py-2 border-b border-gray-700/30 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{product.image}</span>
                  <p className="text-white text-sm font-medium">{product.name}</p>
                </div>
                <span className="text-emerald-400 font-semibold text-sm">${product.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

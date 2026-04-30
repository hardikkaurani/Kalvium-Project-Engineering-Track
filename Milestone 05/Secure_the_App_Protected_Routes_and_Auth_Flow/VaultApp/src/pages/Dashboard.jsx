import React from 'react';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-400 mb-8">
        Welcome back{user ? `, ${user.name}` : ''}! Here's your secure overview.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-1">Total Vaults</p>
          <p className="text-3xl font-bold text-emerald-400">24</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-1">Active Sessions</p>
          <p className="text-3xl font-bold text-cyan-400">3</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <p className="text-gray-400 text-sm mb-1">Security Score</p>
          <p className="text-3xl font-bold text-violet-400">92%</p>
        </div>
      </div>

      <div className="mt-8 bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {['Password updated for GitHub', 'New vault "Work" created', 'Login from Chrome on Windows'].map((item, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-800 last:border-0">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-gray-300 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

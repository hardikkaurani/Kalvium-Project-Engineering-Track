import React from 'react';
import { useAuth } from '../context/AuthContext';

function Profile() {
  const { user } = useAuth();

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl font-bold text-emerald-400">
            {user?.name?.[0] || '?'}
          </div>
          <div>
            <p className="text-lg font-semibold">{user?.name || 'Unknown'}</p>
            <p className="text-gray-400 text-sm">{user?.email || 'No email'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between py-3 border-b border-gray-800">
            <span className="text-gray-400 text-sm">Role</span>
            <span className="text-white text-sm font-medium">Administrator</span>
          </div>
          <div className="flex justify-between py-3 border-b border-gray-800">
            <span className="text-gray-400 text-sm">Member Since</span>
            <span className="text-white text-sm font-medium">March 2024</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-gray-400 text-sm">2FA Status</span>
            <span className="text-emerald-400 text-sm font-medium">Enabled ✓</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

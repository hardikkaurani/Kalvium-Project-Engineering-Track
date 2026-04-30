import React from 'react';

function Settings() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="space-y-5">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Security</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Two-Factor Authentication</span>
              <span className="text-emerald-400 text-sm font-medium">Enabled</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Session Timeout</span>
              <span className="text-gray-400 text-sm">30 minutes</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Notifications</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Email Alerts</span>
              <span className="text-emerald-400 text-sm font-medium">On</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300 text-sm">Login Notifications</span>
              <span className="text-emerald-400 text-sm font-medium">On</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;

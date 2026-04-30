import React from 'react';
import { Link } from 'react-router-dom';

// BUG: Navbar doesn't use auth state at all
// BUG: Always shows "Login" link — never shows user info or logout
function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          🔐 VaultApp
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">
            Dashboard
          </Link>
          {/* BUG: Always shows Login — should show Logout when authenticated */}
          <Link to="/login" className="text-sm px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors">
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

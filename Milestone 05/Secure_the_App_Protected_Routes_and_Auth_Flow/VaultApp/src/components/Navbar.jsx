import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          🔐 VaultApp
        </Link>

        <div className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">
                Dashboard
              </Link>
              <Link to="/profile" className="text-gray-400 hover:text-white text-sm transition-colors">
                Profile
              </Link>
              <Link to="/settings" className="text-gray-400 hover:text-white text-sm transition-colors">
                Settings
              </Link>

              <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
                <span className="text-sm text-emerald-400 font-medium">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-sm px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg transition-all"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="text-sm px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

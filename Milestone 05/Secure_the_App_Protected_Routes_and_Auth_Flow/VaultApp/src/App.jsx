import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

// BUG: No ProtectedRoute wrapping — any user can access /dashboard, /settings, /profile
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-950 text-white">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            {/* BUG: These should be protected but aren't */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

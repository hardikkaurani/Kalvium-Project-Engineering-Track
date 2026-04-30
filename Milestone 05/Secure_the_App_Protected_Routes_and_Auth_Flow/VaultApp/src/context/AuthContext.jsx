import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // FIX: Load auth state from localStorage on mount (persistence across refresh)
  useEffect(() => {
    const savedToken = localStorage.getItem('vault_token');
    const savedUser = localStorage.getItem('vault_user');

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        // Corrupted data — clear it
        localStorage.removeItem('vault_token');
        localStorage.removeItem('vault_user');
      }
    }
  }, []);

  // FIX: login saves to both state AND localStorage
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('vault_token', authToken);
    localStorage.setItem('vault_user', JSON.stringify(userData));
  };

  // FIX: logout clears both state AND localStorage
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('vault_token');
    localStorage.removeItem('vault_user');
  };

  // FIX: Derive isAuthenticated from token
  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

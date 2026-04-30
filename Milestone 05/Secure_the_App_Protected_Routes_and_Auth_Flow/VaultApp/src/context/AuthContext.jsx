import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

// BUG 1: No localStorage persistence — auth is lost on refresh
// BUG 2: login() does NOT save to localStorage
// BUG 3: isAuthenticated is not provided in context
// BUG 4: logout() does NOT clear localStorage
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    // BUG: Missing localStorage.setItem calls
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    // BUG: Missing localStorage.removeItem calls
  };

  return (
    // BUG: isAuthenticated not exposed
    <AuthContext.Provider value={{ user, token, login, logout }}>
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

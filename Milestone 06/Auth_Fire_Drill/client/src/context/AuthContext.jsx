import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // FIX 3: Recover user info from localStorage if token exists
    // (In a real app, we'd fetch profile or decode JWT)
    const storedUser = localStorage.getItem('user');
    if(token && storedUser) {
        setUser(JSON.parse(storedUser));
    }
  }, [token]);

  const login = (data) => {
    localStorage.setItem('token', data.token);
    // FIX 3: Stop storing role as a separate editable key
    localStorage.setItem('user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // Role is now derived from the user object, making it harder to spoof on frontend
  const role = user?.role || 'reader';

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

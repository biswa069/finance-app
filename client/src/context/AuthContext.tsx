import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

// Add a fallback so it defaults to localhost if the .env variable is missing
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      // Auto-save to storage and attach header
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = (newToken: string) => setToken(newToken);
  const logout = () => setToken(null);

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
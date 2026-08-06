import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMeApi } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('omnifusion_user');
      return (saved && saved !== 'undefined') ? JSON.parse(saved) : null;
    } catch (e) {
      console.warn('Failed to parse saved user from localStorage:', e);
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      const saved = localStorage.getItem('omnifusion_token');
      return (saved && saved !== 'undefined') ? saved : null;
    } catch (e) {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await getMeApi();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('omnifusion_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.error('Session restore failed:', err);
          logout();
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const loginUser = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('omnifusion_user', JSON.stringify(userData));
    localStorage.setItem('omnifusion_token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('omnifusion_user');
    localStorage.removeItem('omnifusion_token');
  };

  const updateUserState = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('omnifusion_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginUser, logout, updateUserState, isAuthenticated: Boolean(user && token) }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

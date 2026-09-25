import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('campusride_token');
      if (token) {
        try {
          const res = await API.get('/auth/me');
          if (res.success) {
            setUser(res.data);
          } else {
            localStorage.removeItem('campusride_token');
          }
        } catch (err) {
          console.error('[Auth Init Failed]:', err.message);
          localStorage.removeItem('campusride_token');
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    if (res.success) {
      localStorage.setItem('campusride_token', res.data.token);
      setUser(res.data);
      return res.data;
    }
  };

  // Register Only handler (Creates account without auto-login, forcing user to sign in manually)
  const registerOnly = async (userData) => {
    const res = await API.post('/auth/register', userData);
    return res;
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('campusride_token');
    setUser(null);
  };

  // Update Profile handler
  const updateProfile = async (updateData) => {
    const res = await API.put('/auth/profile', updateData);
    if (res.success) {
      setUser(res.data);
      return res.data;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        registerOnly,
        logout,
        updateProfile,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

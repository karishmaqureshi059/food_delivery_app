import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('foodexpress_token'));
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(() => {
    return localStorage.getItem('foodexpress_location') || '123 Main St, Manhattan, NY';
  });

  // Verify and fetch current user on mount or token change
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const storedToken = localStorage.getItem('foodexpress_token');
      if (!storedToken) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const data = await api.get('/auth/me');
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Session expired or invalid token:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const setAuthSession = (authToken, authUser) => {
    localStorage.setItem('foodexpress_token', authToken);
    setToken(authToken);
    setUser(authUser);
  };

  const login = async (email, password) => {
    const data = await api.post('/auth/login', { email, password });
    if (data.success) {
      setAuthSession(data.token, data.user);
    }
    return data;
  };

  const adminLogin = async (email, password) => {
    const data = await api.post('/auth/admin-login', { email, password });
    if (data.success) {
      setAuthSession(data.token, data.user);
    }
    return data;
  };

  const register = async (userData) => {
    const data = await api.post('/auth/register', userData);
    if (data.success) {
      setAuthSession(data.token, data.user);
    }
    return data;
  };

  const verifyOtpLogin = async ({ phone, email, otp }) => {
    const data = await api.post('/auth/otp-verify', { phone, email, otp });
    if (data.success) {
      setAuthSession(data.token, data.user);
    }
    return data;
  };

  const loginWithGoogle = async (mockGoogleUser) => {
    const data = await api.post('/auth/google', mockGoogleUser || {
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
    });
    if (data.success) {
      setAuthSession(data.token, data.user);
    }
    return data;
  };

  const updateProfile = async (formData) => {
    const data = await api.put('/users/profile', formData);
    if (data.success) {
      setUser((prev) => ({ ...prev, ...data.user }));
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('foodexpress_token');
    setToken(null);
    setUser(null);
  };

  const updateLocation = (newLoc) => {
    setSelectedLocation(newLoc);
    localStorage.setItem('foodexpress_location', newLoc);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        adminLogin,
        register,
        verifyOtpLogin,
        loginWithGoogle,
        updateProfile,
        logout,
        selectedLocation,
        setSelectedLocation: updateLocation
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

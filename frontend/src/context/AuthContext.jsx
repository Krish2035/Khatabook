import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';
import { signInWithGooglePopup } from '../services/firebase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('khatabook_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('khatabook_token') || null);
  const [loading, setLoading] = useState(false);

  const saveAuthSession = (userData, tokenString) => {
    setUser(userData);
    setToken(tokenString);
    localStorage.setItem('khatabook_user', JSON.stringify(userData));
    localStorage.setItem('khatabook_token', tokenString);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('khatabook_user');
    localStorage.removeItem('khatabook_token');
  };

  const signupWithEmail = async ({ name, email, password }) => {
    setLoading(true);
    try {
      const res = await authApi.signup({ name, email, password });
      if (res.success && res.data) {
        saveAuthSession(res.data.user, res.data.token);
        return res.data.user;
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.data) {
        saveAuthSession(res.data.user, res.data.token);
        return res.data.user;
      }
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      // 1. Firebase Google OAuth popup
      const googleData = await signInWithGooglePopup();

      // 2. Transmit verified Google profile to backend for registration & JWT creation
      const res = await authApi.googleAuth({
        email: googleData.email,
        name: googleData.displayName,
        avatar: googleData.photoURL,
        googleUid: googleData.uid,
      });

      if (res.success && res.data) {
        saveAuthSession(res.data.user, res.data.token);
        return res.data.user;
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user && token),
        loading,
        signupWithEmail,
        loginWithEmail,
        loginWithGoogle,
        logout,
      }}
    >
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

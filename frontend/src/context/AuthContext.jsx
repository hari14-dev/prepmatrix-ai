import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('sp3_token'));
  const [user, setUser] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setIsCheckingSession(false);
      return;
    }

    setIsCheckingSession(true);
    apiRequest('/api/auth/me', { token })
      .then((response) => {
        setUser(response.data.user);
      })
      .catch(() => {
        localStorage.removeItem('sp3_token');
        setToken(null);
        setUser(null);
      })
      .finally(() => setIsCheckingSession(false));
  }, [token]);

  const login = (payload) => {
    localStorage.setItem('sp3_token', payload.token);
    setToken(payload.token);
    setUser(payload.user);
  };

  const logout = () => {
    localStorage.removeItem('sp3_token');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isCheckingSession,
      login,
      logout
    }),
    [token, user, isCheckingSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}

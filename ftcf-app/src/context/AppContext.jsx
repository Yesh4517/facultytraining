import { createContext, useState, useEffect } from 'react';
import { api } from '../api/client';

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // true while restoring session

  // ── Restore session from localStorage on app load ────────────────────────
  useEffect(() => {
    const token = localStorage.getItem('ftcf_token');
    if (!token) { setAuthLoading(false); return; }

    api.get('/auth/me')
      .then((user) => setCurrentUser(user))
      .catch(() => localStorage.removeItem('ftcf_token'))
      .finally(() => setAuthLoading(false));
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const { token, user } = await api.post('/auth/login', { email, password });
      localStorage.setItem('ftcf_token', token);
      setCurrentUser(user);
      return { success: true, role: user.role };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = () => {
    localStorage.removeItem('ftcf_token');
    setCurrentUser(null);
  };

  // ── Update current user (after profile save) ─────────────────────────────
  const updateCurrentUser = (updates) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AppContext.Provider value={{ currentUser, authLoading, login, logout, updateCurrentUser }}>
      {children}
    </AppContext.Provider>
  );
}

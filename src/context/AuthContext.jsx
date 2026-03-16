import { createContext, useState, useEffect, useCallback } from "react";

const BASE = import.meta.env.VITE_API_URL || "";
const TOKEN_KEY = "keepalive_token";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Fetch latest user from backend ────────────────────────────────────────
  const fetchMe = useCallback(async (token) => {
    try {
      const res = await fetch(`${BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Unauthorized");
      return await res.json();
    } catch {
      return null;
    }
  }, []);

  // ── On mount: restore session from localStorage ───────────────────────────
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        const me = await fetchMe(token);
        if (me) setUser({ ...me, token });
        else localStorage.removeItem(TOKEN_KEY); // token expired/invalid
      }
      setLoading(false);
    };
    init();
  }, [fetchMe]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const login = useCallback((token, userData) => {
    localStorage.setItem(TOKEN_KEY, token);
    setUser({ ...userData, token });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  // Re-fetch user from backend (used on pending page to check approval)
  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return;
    const me = await fetchMe(token);
    if (me) setUser({ ...me, token });
  }, [fetchMe]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Helper — returns the stored JWT token (used in Api.js)
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
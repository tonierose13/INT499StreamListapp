// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = "streamlist_auth_v1";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load auth state from localStorage on app start
  useEffect(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.isAuthenticated) {
          setUser(parsed.user || { name: "Student User" });
          setIsAuthenticated(true);
        }
      }
    } catch (error) {
      console.error("Failed to load auth state:", error);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  // Persist auth state to localStorage
  useEffect(() => {
    if (loading) return;

    try {
      if (isAuthenticated) {
        localStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({
            isAuthenticated: true,
            user: user || { name: "Student User" },
          })
        );
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (error) {
      console.error("Failed to save auth state:", error);
    }
  }, [isAuthenticated, user, loading]);

  // Temporary login (Step 1)
  // Later in Step 2, replace this with real OAuth success data
  const login = (userData = { name: "Student User" }) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      loading,
      login,
      logout,
    }),
    [user, isAuthenticated, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
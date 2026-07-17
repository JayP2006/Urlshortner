import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi } from "../api/endpoints.js";
import { setUnauthorizedHandler } from "../api/axios.js";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

const STORAGE_KEY = "shrinkx.user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [initializing, setInitializing] = useState(false);

  const persist = (u) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const login = useCallback(async ({ email, password }) => {
    const { data } = await authApi.login({ email, password });
    persist(data.user);
    toast.success(data.message || "Welcome back!");
    return data.user;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const { data } = await authApi.register({ name, email, password });
    persist(data.user);
    toast.success(data.message || "Account created");
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {}
    persist(null);
    toast.success("Signed out");
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      persist(null);
    });
  }, []);

  const value = {
    user,
    isAuthenticated: !!user,
    initializing,
    login,
    register,
    logout,
    updateUser: persist,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

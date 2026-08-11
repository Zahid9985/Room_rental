import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { adminApi } from "../api/adminApi";
import type { AdminUser } from "../api/types";

interface AuthContextValue {
  admin: AdminUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const readStoredAdmin = () => {
  const raw = localStorage.getItem("adminUser");
  return raw ? (JSON.parse(raw) as AdminUser) : null;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("adminToken"));
  const [admin, setAdmin] = useState<AdminUser | null>(() => readStoredAdmin());

  const login = async (email: string, password: string) => {
    const result = await adminApi.login(email, password);
    localStorage.setItem("adminToken", result.token);
    localStorage.setItem("adminUser", JSON.stringify(result.admin));
    setToken(result.token);
    setAdmin(result.admin);
  };

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setToken(null);
    setAdmin(null);
  };

  const value = useMemo(
    () => ({ admin, token, login, logout, isAuthenticated: Boolean(token) }),
    [admin, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const AuthContext = createContext(null);

const STORAGE_USER = "auth_user";
const STORAGE_USERS = "demo_users";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_USER);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      setUser(null);
    }
  }, []);

  const login = useCallback((email, password) => {
    const trimmed = email.trim();
    if (!trimmed || !password) {
      return { ok: false, message: "Email and password are required." };
    }
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem(STORAGE_USERS) || "[]");
    } catch {
      users = [];
    }
    const found = users.find(
      (u) => u.email === trimmed && u.password === password,
    );
    if (!found) {
      return { ok: false, message: "Invalid email or password." };
    }
    const session = { email: trimmed };
    localStorage.setItem(STORAGE_USER, JSON.stringify(session));
    setUser(session);
    return { ok: true };
  }, []);

  const register = useCallback((email, password) => {
    const trimmed = email.trim();
    if (!trimmed || !password) {
      return { ok: false, message: "Email and password are required." };
    }
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem(STORAGE_USERS) || "[]");
    } catch {
      users = [];
    }
    if (users.some((u) => u.email === trimmed)) {
      return { ok: false, message: "An account with this email already exists." };
    }
    users.push({ email: trimmed, password });
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
    const session = { email: trimmed };
    localStorage.setItem(STORAGE_USER, JSON.stringify(session));
    setUser(session);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_USER);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, login, register, logout }),
    [user, login, register, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

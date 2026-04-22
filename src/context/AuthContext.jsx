import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { currentUser, teamMembers } from "@/data/mockData";

const AuthContext = createContext(null);

const DEMO_ACCOUNTS = [
  {
    label: "Admin",
    email: "admin@propflow.com",
    password: "admin123",
    role: "admin",
  },
  {
    label: "Manager",
    email: "manager@propflow.com",
    password: "manager123",
    role: "manager",
  },
  {
    label: "Sales Executive",
    email: "sales@propflow.com",
    password: "sales123",
    role: "sales_executive",
  },
];

const USERS_BY_EMAIL = {
  "admin@propflow.com": {
    ...currentUser,
    email: "admin@propflow.com",
    role: "admin",
  },
  "manager@propflow.com":
    teamMembers.find((member) => member.role === "manager") ?? currentUser,
  "sales@propflow.com":
    teamMembers.find((member) => member.role === "sales_executive") ??
    currentUser,
};

const STORAGE_KEY = "auth_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      setUser({
        ...parsed,
        lastLogin: parsed.lastLogin ? new Date(parsed.lastLogin) : new Date(),
      });
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = async (email, password) => {
    const match = DEMO_ACCOUNTS.find(
      (account) => account.email === email && account.password === password,
    );
    if (!match) return false;

    const nextUser = USERS_BY_EMAIL[email];
    if (!nextUser) return false;

    const updatedUser = { ...nextUser, lastLogin: new Date() };
    setUser(updatedUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(
    () => ({ user, login, logout, demoAccounts: DEMO_ACCOUNTS }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}


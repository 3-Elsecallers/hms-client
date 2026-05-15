"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string | null;
  department: string;
  emailVerified: boolean;
  approvalStatus: ApprovalStatus;
  createdAt: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  department: string;
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AuthResult>;
  register: (data: RegisterData) => Promise<AuthResult>;
  verifyEmail: (code: string) => Promise<AuthResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = "hms_users";
const CURRENT_USER_KEY = "hms_current_user_id";
export const DEMO_OTP = "123456";

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function getUsers(): User[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users: User[]): void {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem(CURRENT_USER_KEY);
    if (userId) {
      const found = getUsers().find((u) => u.id === userId);
      if (found) setUser(found);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      await new Promise((r) => setTimeout(r, 750));
      const found = getUsers().find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
      );
      if (!found) {
        return { success: false, error: "Invalid email or password." };
      }
      setUser(found);
      localStorage.setItem(CURRENT_USER_KEY, found.id);
      return { success: true };
    },
    []
  );

  const register = useCallback(
    async (data: RegisterData): Promise<AuthResult> => {
      await new Promise((r) => setTimeout(r, 750));
      const users = getUsers();
      if (
        users.find(
          (u) => u.email.toLowerCase() === data.email.toLowerCase()
        )
      ) {
        return {
          success: false,
          error: "An account with this email already exists.",
        };
      }
      const newUser: User = {
        id: generateId(),
        name: data.name,
        email: data.email,
        password: data.password,
        department: data.department,
        role: null,
        emailVerified: false,
        approvalStatus: "pending",
        createdAt: new Date().toISOString(),
      };
      saveUsers([...users, newUser]);
      setUser(newUser);
      localStorage.setItem(CURRENT_USER_KEY, newUser.id);
      return { success: true };
    },
    []
  );

  const verifyEmail = useCallback(
    async (code: string): Promise<AuthResult> => {
      await new Promise((r) => setTimeout(r, 600));
      if (code !== DEMO_OTP) {
        return {
          success: false,
          error: `Invalid code. Use ${DEMO_OTP} for this demo.`,
        };
      }
      if (!user) return { success: false, error: "No active session." };
      const updated = getUsers().map((u) =>
        u.id === user.id ? { ...u, emailVerified: true } : u
      );
      saveUsers(updated);
      const updatedUser = { ...user, emailVerified: true };
      setUser(updatedUser);
      return { success: true };
    },
    [user]
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, verifyEmail, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

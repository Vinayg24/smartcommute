import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  phone: string;
  department: string;
  role: 'EMPLOYEE' | 'MANAGER' | 'HR' | 'ADMIN';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  isManager: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USERS: Record<
  string,
  { password: string; user: User }
> = {
  'admin@smartcommute.com': {
    password: 'admin123',
    user: {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@smartcommute.com',
      employeeId: 'ADM001',
      phone: '+91 90000 00001',
      department: 'Engineering',
      role: 'ADMIN',
    },
  },
  'rahul@smartcommute.com': {
    password: 'user123',
    user: {
      id: 'user-1',
      name: 'Rahul Sharma',
      email: 'rahul@smartcommute.com',
      employeeId: 'EMP001',
      phone: '+91 90000 00002',
      department: 'Engineering',
      role: 'EMPLOYEE',
    },
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('demo_user');
    if (saved) {
      try {
        const parsed: User = JSON.parse(saved);
        setUser(parsed);
        setToken('mock-token');
      } catch {
        // ignore
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const key = email.toLowerCase();
      const match = DEMO_USERS[key];
      if (!match || match.password !== password) {
        throw new Error('Invalid credentials');
      }
      setUser(match.user);
      setToken('mock-token');
      localStorage.setItem('demo_user', JSON.stringify(match.user));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('demo_user');
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
        isAdmin: user?.role === 'ADMIN',
        isManager: user?.role === 'MANAGER' || user?.role === 'ADMIN',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  phone: string;
  department: string;
  role: 'EMPLOYEE' | 'MANAGER' | 'ADMIN';
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

// Mock user for demo
const MOCK_USER: User = {
  id: '1',
  name: 'Rahul Sharma',
  email: 'rahul@smartcommute.com',
  employeeId: 'EMP001',
  phone: '+91 98765 43210',
  department: 'Engineering',
  role: 'ADMIN',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('smartcommute_token');
    const savedUser = localStorage.getItem('smartcommute_user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, _password: string) => {
    // Mock login - in production, call authAPI.login()
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    const mockToken = 'mock_jwt_token_' + Date.now();
    const mockUser = { ...MOCK_USER, email };
    localStorage.setItem('smartcommute_token', mockToken);
    localStorage.setItem('smartcommute_user', JSON.stringify(mockUser));
    setToken(mockToken);
    setUser(mockUser);
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('smartcommute_token');
    localStorage.removeItem('smartcommute_user');
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

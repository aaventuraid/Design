'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on mount
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user_data');

    if (savedToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setToken(savedToken);
        setUser(userData);

        // Verify token is still valid
        fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${savedToken}` },
        })
          .then(async (res) => {
            if (!res.ok) {
              // Token invalid, clear auth
              localStorage.removeItem('auth_token');
              localStorage.removeItem('user_data');
              setToken(null);
              setUser(null);
            } else {
              const { user: currentUser } = await res.json();
              setUser(currentUser);
            }
          })
          .catch(() => {
            // Network error, keep current state but show warning
            console.warn('Unable to verify auth token');
          });
      } catch {
        // Invalid saved data
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }

    setIsLoading(false);
  }, []);

  const login = (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('auth_token', newToken);
    localStorage.setItem('user_data', JSON.stringify(userData));
  };

  const logout = async () => {
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error('Logout API error:', error);
      }
    }

    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

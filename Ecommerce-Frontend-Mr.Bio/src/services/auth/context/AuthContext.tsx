/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  userId: string;
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [userId, setUserId] = useState<string>(localStorage.getItem("userId") || "");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = (token: string, userId: string) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem("userId", userId);
    try {
      const decoded: any = jwtDecode(token);
      setUserId(userId);
      setIsAuthenticated(true);
      setUser(decoded);
    } catch (error) {
      console.error('Invalid token during login:', error);
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('userId');
    setUser(null);
    setUserId("");
    setIsAuthenticated(false);
  };

  const setTokenDetails = (token: string) => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUser(decoded);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Invalid token:', error);
        setIsAuthenticated(false);
        setUser(null);
      }
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setTokenDetails(token || '');
  }, []); // Empty dependency array since we only want this to run once on mount

  return (
    <AuthContext.Provider value={{ userId, user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
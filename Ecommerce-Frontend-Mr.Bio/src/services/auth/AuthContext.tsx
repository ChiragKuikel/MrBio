/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  userId:string,
  user: any;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userId:string) => void;
  logout: () => void;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [userId, setUserId] = useState<string>(localStorage.getItem("user_id") || "");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('access_token');
  const navigate = useNavigate();
  
  const login =async (token: string,userId:string) => {
   await localStorage.setItem('access_token', token);
   localStorage.setItem("userId", userId);
   const decoded: any = jwtDecode(token);
   setUserId(userId);
    setIsAuthenticated(true);
    setUser(decoded);
  };

  const logout = async() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('userId');
    setUser(null);
    setIsAuthenticated(false);
    await navigate("/home/login");
  };

  const setTokenDetails =(token: string) => {
    if (token) {
    try {
      const decoded: any = jwtDecode(token);
      setUser(decoded);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Invalid token:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false); // Moved inside finally
    }
  } else {
    setIsLoading(false);
  }
  }

  useEffect(() => {
  setTokenDetails(token || '')
}, [token]);

  return (
    <AuthContext.Provider
      value={{userId, user, isAuthenticated, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

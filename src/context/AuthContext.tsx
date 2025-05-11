
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

export type PlanType = 'free' | 'basic' | 'premium';

interface User {
  id: string;
  email: string;
  name: string;
  plan: PlanType;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserPlan: (plan: PlanType) => void;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUserPlan: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user in localStorage
    const storedUser = localStorage.getItem('studyboost_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login for now - would be replaced with actual API call
    setIsLoading(true);
    
    // Simple validation
    if (!email || !password) {
      throw new Error('Please provide both email and password');
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, create a mock user
      const mockUser = {
        id: '1',
        email,
        name: email.split('@')[0],
        plan: 'free' as PlanType
      };
      
      setUser(mockUser);
      localStorage.setItem('studyboost_user', JSON.stringify(mockUser));
      
      setIsLoading(false);
      return;
    } catch (error) {
      setIsLoading(false);
      throw new Error('Failed to login');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    // Mock registration - would be replaced with actual API call
    setIsLoading(true);
    
    // Simple validation
    if (!name || !email || !password) {
      throw new Error('Please fill all required fields');
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, create a new user
      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        plan: 'free' as PlanType
      };
      
      setUser(newUser);
      localStorage.setItem('studyboost_user', JSON.stringify(newUser));
      
      setIsLoading(false);
      return;
    } catch (error) {
      setIsLoading(false);
      throw new Error('Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('studyboost_user');
  };

  const updateUserPlan = (plan: PlanType) => {
    if (user) {
      const updatedUser = { ...user, plan };
      setUser(updatedUser);
      localStorage.setItem('studyboost_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, updateUserPlan }}>
      {children}
    </AuthContext.Provider>
  );
};

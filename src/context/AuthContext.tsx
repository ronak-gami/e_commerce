import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { setAuthToken } from '../apis/client';
import { storage, STORAGE_KEYS } from '../services/storage';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider?: 'email' | 'google' | 'apple' | 'facebook';
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  loginWithSocial: (provider: 'google' | 'apple' | 'facebook') => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  // Load persisted session on app start
  useEffect(() => {
    const restoreSession = async () => {
      const savedUser = await storage.getItem<UserProfile>(STORAGE_KEYS.AUTH_USER);
      const savedToken = await storage.getItem<string>(STORAGE_KEYS.AUTH_TOKEN);
      if (savedUser && savedToken) {
        setUser(savedUser);
        setAuthToken(savedToken);
      }
    };
    restoreSession();
  }, []);

  const login = async (email: string, _pass: string): Promise<boolean> => {
    const mockUser: UserProfile = {
      id: 'usr_' + Date.now(),
      name: email.split('@')[0] || 'Beauty Connoisseur',
      email,
      provider: 'email',
    };
    const token = 'mock_jwt_token_' + Date.now();
    setUser(mockUser);
    setAuthToken(token);
    await storage.setItem(STORAGE_KEYS.AUTH_USER, mockUser);
    await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    return true;
  };

  const register = async (name: string, email: string, _pass: string): Promise<boolean> => {
    const mockUser: UserProfile = {
      id: 'usr_' + Date.now(),
      name,
      email,
      provider: 'email',
    };
    const token = 'mock_jwt_token_' + Date.now();
    setUser(mockUser);
    setAuthToken(token);
    await storage.setItem(STORAGE_KEYS.AUTH_USER, mockUser);
    await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    return true;
  };

  const loginWithSocial = async (provider: 'google' | 'apple' | 'facebook'): Promise<boolean> => {
    const providerNames: Record<string, string> = {
      google: 'Google User',
      apple: 'Apple VIP',
      facebook: 'Facebook User',
    };
    const mockUser: UserProfile = {
      id: `${provider}_` + Date.now(),
      name: providerNames[provider] || 'Social User',
      email: `${provider}.user@makeupstore.com`,
      provider,
    };
    const token = `mock_${provider}_token_` + Date.now();
    setUser(mockUser);
    setAuthToken(token);
    await storage.setItem(STORAGE_KEYS.AUTH_USER, mockUser);
    await storage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    return true;
  };

  const logout = async () => {
    setUser(null);
    setAuthToken(null);
    await storage.removeItem(STORAGE_KEYS.AUTH_USER);
    await storage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        loginWithSocial,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

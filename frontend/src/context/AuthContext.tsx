'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  username: string;
  name: string;
  role: string;
  avatarUrl?: string;
  country?: string;
  countryCode?: string;
  gender?: string;
  language?: string;
  interests?: string;
  bio?: string;
  coins: number;
  level: number;
  isVerified: boolean;
  isPremium: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUserCoins: (coins: number) => void;
  updateUserProfile: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
  updateUserCoins: () => {},
  updateUserProfile: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('novachat_token');
    const storedUser = localStorage.getItem('novachat_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored auth user');
      }
    } else {
      // Default Demo User for instant zero-friction play!
      const demoUser: User = {
        id: 'demo_user_1',
        email: 'user@novachat.live',
        username: 'nova_explorer',
        name: 'Demo Explorer',
        role: 'USER',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        country: 'United States',
        countryCode: 'US',
        gender: 'Male',
        language: 'English',
        interests: 'Gaming, Music, Tech',
        bio: 'Exploring the world through NovaChat!',
        coins: 500,
        level: 3,
        isVerified: true,
        isPremium: false,
      };
      setToken('demo_jwt_token_2026');
      setUser(demoUser);
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('novachat_token', newToken);
    localStorage.setItem('novachat_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('novachat_token');
    localStorage.removeItem('novachat_user');
  };

  const updateUserCoins = (coins: number) => {
    if (user) {
      const updated = { ...user, coins };
      setUser(updated);
      localStorage.setItem('novachat_user', JSON.stringify(updated));
    }
  };

  const updateUserProfile = (updatedData: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updatedData };
      setUser(updated);
      localStorage.setItem('novachat_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, updateUserCoins, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserSession } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: UserSession | null;
  portalType: 'farmer' | 'buyer' | 'staff' | null;
  loading: boolean;
  loginFarmer: (identifier: string, pass: string) => Promise<void>;
  registerFarmer: (data: any) => Promise<void>;
  loginBuyer: (identifier: string, pass: string) => Promise<void>;
  registerBuyer: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [portalType, setPortalType] = useState<'farmer' | 'buyer' | 'staff' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session
    const storedToken = localStorage.getItem('cropcompaz_token');
    const storedPortal = localStorage.getItem('cropcompaz_portal') as 'farmer' | 'buyer' | 'staff' | null;
    const storedUser = localStorage.getItem('cropcompaz_user');

    if (storedToken && storedUser && storedPortal) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({ ...parsed, token: storedToken });
        setPortalType(storedPortal);
      } catch (e) {
        localStorage.removeItem('cropcompaz_token');
        localStorage.removeItem('cropcompaz_portal');
        localStorage.removeItem('cropcompaz_user');
      }
    }
    setLoading(false);
  }, []);

  const loginFarmer = async (identifier: string, pass: string) => {
    const session = await api.loginFarmer(identifier, pass);
    localStorage.setItem('cropcompaz_token', session.token);
    localStorage.setItem('cropcompaz_portal', 'farmer');
    localStorage.setItem('cropcompaz_user', JSON.stringify(session));
    setUser(session);
    setPortalType('farmer');
  };

  const registerFarmer = async (data: any) => {
    const session = await api.registerFarmer(data);
    localStorage.setItem('cropcompaz_token', session.token);
    localStorage.setItem('cropcompaz_portal', 'farmer');
    localStorage.setItem('cropcompaz_user', JSON.stringify(session));
    setUser(session);
    setPortalType('farmer');
  };

  const loginBuyer = async (identifier: string, pass: string) => {
    const session = await api.loginBuyer(identifier, pass);
    localStorage.setItem('cropcompaz_token', session.token);
    localStorage.setItem('cropcompaz_portal', 'buyer');
    localStorage.setItem('cropcompaz_user', JSON.stringify(session));
    setUser(session);
    setPortalType('buyer');
  };

  const registerBuyer = async (data: any) => {
    const session = await api.registerBuyer(data);
    localStorage.setItem('cropcompaz_token', session.token);
    localStorage.setItem('cropcompaz_portal', 'buyer');
    localStorage.setItem('cropcompaz_user', JSON.stringify(session));
    setUser(session);
    setPortalType('buyer');
  };

  const logout = async () => {
    await api.logout();
    localStorage.removeItem('cropcompaz_token');
    localStorage.removeItem('cropcompaz_portal');
    localStorage.removeItem('cropcompaz_user');
    setUser(null);
    setPortalType(null);
  };

  return (
    <AuthContext.Provider value={{ user, portalType, loading, loginFarmer, registerFarmer, loginBuyer, registerBuyer, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedPortal: 'farmer' | 'buyer' | 'staff';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedPortal }) => {
  const { user, portalType, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center text-xs font-semibold text-stone-500">
        Loading CropCompaz Portal...
      </div>
    );
  }

  if (!user || portalType !== allowedPortal) {
    const redirectPath = allowedPortal === 'farmer' ? '/farmer/login' : allowedPortal === 'buyer' ? '/buyer/login' : '/staff/login';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

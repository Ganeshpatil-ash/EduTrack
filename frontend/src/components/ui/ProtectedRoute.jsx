import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-canvas dark:bg-canvas-dark">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600 dark:border-slate-700" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
};

export default ProtectedRoute;

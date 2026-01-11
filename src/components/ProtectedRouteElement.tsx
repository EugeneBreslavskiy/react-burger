import React, { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../hooks/redux';

interface ProtectedRouteSchema {
  children: ReactElement;
  authOnly?: boolean;
  guestOnly?: boolean;
  requireForgotFlow?: boolean;
}

export const ProtectedRouteElement: FC<ProtectedRouteSchema> = ({
  children,
  authOnly,
  guestOnly,
  requireForgotFlow,
}) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const authLoading = useAppSelector((state) => state.auth.loading);
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  if (authLoading === 'idle' || (authLoading === 'pending' && !user)) {
    return null;
  }

  if (requireForgotFlow) {
    const forgotVisited = typeof window !== 'undefined'
      ? window.sessionStorage.getItem('forgotPasswordVisited') === 'true'
      : false;

    if (!forgotVisited) {
      return <Navigate to="/forgot-password" replace state={{ from: location }} />;
    }
  }

  if (authOnly && !isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (guestOnly && isAuthenticated) {
    const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return children;
};



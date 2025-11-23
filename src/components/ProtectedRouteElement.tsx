import React, { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../services/store';

type ProtectedRouteProps = {
  children: ReactElement;
  authOnly?: boolean;
  guestOnly?: boolean;
  requireForgotFlow?: boolean;
};

export const ProtectedRouteElement: FC<ProtectedRouteProps> = ({
  children,
  authOnly,
  guestOnly,
  requireForgotFlow,
}) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const authLoading = useSelector((state: RootState) => state.auth.loading);
  const location = useLocation();

  if (authLoading === 'pending') {
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
    const from = (location.state as any)?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return children;
};



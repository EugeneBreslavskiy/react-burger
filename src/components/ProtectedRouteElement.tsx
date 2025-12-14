import React, { FC, ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../services/store';

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
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const authLoading = useSelector((state: RootState) => state.auth.loading);
  const user = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();

  // Ждем завершения проверки авторизации только при первой загрузке (idle)
  // Если пользователь уже авторизован, не скрываем UI при pending (например, при обновлении профиля)
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
    const from = (location.state as any)?.from?.pathname || '/';
    return <Navigate to={from} replace />;
  }

  return children;
};



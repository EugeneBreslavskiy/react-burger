import { createAsyncThunk } from '@reduxjs/toolkit';
import { HttpClient } from '../utils/httpClient';
import { API_URL } from '../utils/api';
import { setCookie, deleteCookie, getCookie } from '../utils/cookies';
import type { AuthUser } from './authSlice';

type AuthResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
};

type TokenResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

const httpClient = new HttpClient({ baseUrl: API_URL });
const ACCESS_COOKIE_KEY = 'accessToken';
const REFRESH_STORAGE_KEY = 'refreshToken';
const ACCESS_TTL_MINUTES = 20;

export const registerUser = createAsyncThunk<AuthResponse, { email: string; password: string; name: string }>(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await httpClient.post<AuthResponse>('auth/register', payload);

      if (!response?.success) throw new Error('Регистрация не удалась');

      setCookie(ACCESS_COOKIE_KEY, response.accessToken, ACCESS_TTL_MINUTES);

      window.localStorage.setItem(REFRESH_STORAGE_KEY, response.refreshToken);

      return response;
    } catch (err) {
      return rejectWithValue((err as Error).message || 'Регистрация не удалась');
    }
  }
);

export const loginUser = createAsyncThunk<AuthResponse, { email: string; password: string }>(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await httpClient.post<AuthResponse>('auth/login', payload);

      if (!response?.success) throw new Error('Авторизация не удалась');

      setCookie(ACCESS_COOKIE_KEY, response.accessToken, ACCESS_TTL_MINUTES);

      window.localStorage.setItem(REFRESH_STORAGE_KEY, response.refreshToken);

      return response;
    } catch (err) {
      return rejectWithValue((err as Error).message || 'Авторизация не удалась');
    }
  }
);

export const refreshToken = createAsyncThunk<TokenResponse>(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const refreshTokenValue = window.localStorage.getItem(REFRESH_STORAGE_KEY) || '';

      if (!refreshTokenValue) throw new Error('Отсутствует refreshToken');

      const response = await httpClient.post<TokenResponse>('auth/token', { token: refreshTokenValue });

      if (!response?.success) throw new Error('Не удалось обновить токен');

      setCookie(ACCESS_COOKIE_KEY, response.accessToken, ACCESS_TTL_MINUTES);

      window.localStorage.setItem(REFRESH_STORAGE_KEY, response.refreshToken);

      return response;
    } catch (err) {
      return rejectWithValue((err as Error).message || 'Не удалось обновить токен');
    }
  }
);

export const logoutUser = createAsyncThunk<{ success: boolean; message?: string }>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const refreshTokenValue = window.localStorage.getItem(REFRESH_STORAGE_KEY) || '';

      if (!refreshTokenValue) throw new Error('Отсутствует refreshToken');

      const response = await httpClient.post<{ success: boolean; message?: string }>('auth/logout', {
        token: refreshTokenValue,
      });

      if (!response?.success) throw new Error('Выход не удался');

      deleteCookie(ACCESS_COOKIE_KEY);

      window.localStorage.removeItem(REFRESH_STORAGE_KEY);

      return response;
    } catch (err) {
      return rejectWithValue((err as Error).message || 'Выход не удался');
    }
  }
);

type GetUserResponse = {
  success: boolean;
  user: AuthUser;
};

export const getUser = createAsyncThunk<GetUserResponse>(
  'auth/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await httpClient.get<GetUserResponse>('auth/user');

      if (!response?.success) throw new Error('Не удалось получить данные пользователя');

      return response;
    } catch (err) {
      return rejectWithValue((err as Error).message || 'Не удалось получить данные пользователя');
    }
  }
);

export const checkAuth = createAsyncThunk<AuthUser | null>(
  'auth/checkAuth',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const accessToken = getCookie(ACCESS_COOKIE_KEY);
      const refreshTokenValue = window.localStorage.getItem(REFRESH_STORAGE_KEY);

      if (!accessToken && !refreshTokenValue) {
        return null;
      }

      if (!accessToken && refreshTokenValue) {
        const refreshResult = await dispatch(refreshToken()).unwrap();
        if (!refreshResult?.success) {
          return null;
        }
      }

      const userResult = await dispatch(getUser()).unwrap();
      if (!userResult?.success || !userResult.user) {
        return null;
      }

      return userResult.user;
    } catch (err) {
      return null;
    }
  }
);

export { ACCESS_COOKIE_KEY, REFRESH_STORAGE_KEY };



import { createAsyncThunk } from '@reduxjs/toolkit';
import { HttpClient } from '../utils/httpClient';
import { API_URL } from '../utils/api';

const httpClient = new HttpClient({ baseUrl: API_URL });

type ResetRequestResponse = {
  success: boolean;
  message: string;
};

export const requestPasswordReset = createAsyncThunk<
  ResetRequestResponse,
  { email: string }
>('password/requestReset', async ({ email }, { rejectWithValue }) => {
  try {
    const response = await httpClient.post<ResetRequestResponse>('password-reset', { email });

    if (!response?.success) throw new Error('Не удалось отправить письмо для восстановления');

    return response;
  } catch (err) {
    return rejectWithValue((err as Error).message || 'Не удалось отправить письмо для восстановления');
  }
});

export const resetPassword = createAsyncThunk<
  ResetRequestResponse,
  { password: string; token: string }
>('password/reset', async ({ password, token }, { rejectWithValue }) => {
  try {
    const response = await httpClient.post<ResetRequestResponse>('password-reset/reset', {
      password,
      token,
    });

    if (!response?.success) throw new Error('Не удалось сбросить пароль');

    return response;
  } catch (err) {
    return rejectWithValue((err as Error).message || 'Не удалось сбросить пароль');
  }
});



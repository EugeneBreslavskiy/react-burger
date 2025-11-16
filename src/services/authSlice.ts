import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, logoutUser, refreshToken, registerUser } from './authActions';

export type AuthUser = {
  email: string;
  name: string;
};

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: 'idle',
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Optional local reducer to set user from persisted data if needed
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, state => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = (action.payload as string) || action.error.message || 'Регистрация не удалась';
      })
      .addCase(loginUser.pending, state => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = (action.payload as string) || action.error.message || 'Авторизация не удалась';
      })
      .addCase(refreshToken.pending, state => {
        // keep loading idle to avoid UI jank; token refresh is background
      })
      .addCase(refreshToken.fulfilled, state => {
        // nothing to change in user directly
      })
      .addCase(refreshToken.rejected, state => {
        // do not force logout here automatically
      })
      .addCase(logoutUser.pending, state => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, state => {
        state.loading = 'succeeded';
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = (action.payload as string) || action.error.message || 'Выход не удался';
      });
  },
});

export const { setUser } = authSlice.actions;
export const { reducer: authReducer } = authSlice;
export type { AuthState };



import { authReducer, setUser, initialState } from './authSlice';
import { registerUser, loginUser, logoutUser, getUser, checkAuth, updateUser } from './authActions';
import type { AuthUser } from './authSlice';

const mockUser: AuthUser = {
  email: 'test@example.com',
  name: 'Test User',
};

describe('authReducer', () => {
  it('should return initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setUser', () => {
    const action = setUser(mockUser);
    const result = authReducer(initialState, action);

    expect(result.user).toEqual(mockUser);
    expect(result.isAuthenticated).toBe(true);
  });

  it('should handle setUser with null', () => {
    const stateWithUser = { ...initialState, user: mockUser, isAuthenticated: true };
    const action = setUser(null);
    const result = authReducer(stateWithUser, action);

    expect(result.user).toBeNull();
    expect(result.isAuthenticated).toBe(false);
  });

  it('should handle registerUser.pending', () => {
    const action = { type: registerUser.pending.type };
    const result = authReducer(initialState, action);

    expect(result.loading).toBe('pending');
    expect(result.error).toBeNull();
  });

  it('should handle registerUser.fulfilled', () => {
    const statePending = { ...initialState, loading: 'pending' as const };
    const action = {
      type: registerUser.fulfilled.type,
      payload: {
        success: true,
        accessToken: 'token',
        refreshToken: 'refresh',
        user: mockUser,
      },
    };
    const result = authReducer(statePending, action);

    expect(result.loading).toBe('succeeded');
    expect(result.user).toEqual(mockUser);
    expect(result.isAuthenticated).toBe(true);
  });

  it('should handle registerUser.rejected', () => {
    const statePending = { ...initialState, loading: 'pending' as const };
    const action = {
      type: registerUser.rejected.type,
      payload: 'Ошибка регистрации',
    };
    const result = authReducer(statePending, action);

    expect(result.loading).toBe('failed');
    expect(result.error).toBe('Ошибка регистрации');
    expect(result.isAuthenticated).toBe(false);
  });

  it('should handle loginUser.pending', () => {
    const action = { type: loginUser.pending.type };
    const result = authReducer(initialState, action);

    expect(result.loading).toBe('pending');
    expect(result.error).toBeNull();
  });

  it('should handle loginUser.fulfilled', () => {
    const statePending = { ...initialState, loading: 'pending' as const };
    const action = {
      type: loginUser.fulfilled.type,
      payload: {
        success: true,
        accessToken: 'token',
        refreshToken: 'refresh',
        user: mockUser,
      },
    };
    const result = authReducer(statePending, action);

    expect(result.loading).toBe('succeeded');
    expect(result.user).toEqual(mockUser);
    expect(result.isAuthenticated).toBe(true);
  });

  it('should handle loginUser.rejected', () => {
    const statePending = { ...initialState, loading: 'pending' as const };
    const action = {
      type: loginUser.rejected.type,
      payload: 'Ошибка авторизации',
    };
    const result = authReducer(statePending, action);

    expect(result.loading).toBe('failed');
    expect(result.error).toBe('Ошибка авторизации');
  });

  it('should handle logoutUser.fulfilled', () => {
    const stateWithUser = { ...initialState, user: mockUser, isAuthenticated: true, loading: 'pending' as const };
    const action = { type: logoutUser.fulfilled.type };
    const result = authReducer(stateWithUser, action);

    expect(result.loading).toBe('succeeded');
    expect(result.user).toBeNull();
    expect(result.isAuthenticated).toBe(false);
  });

  it('should handle logoutUser.rejected', () => {
    const stateWithUser = { ...initialState, user: mockUser, isAuthenticated: true, loading: 'pending' as const };
    const action = {
      type: logoutUser.rejected.type,
      payload: 'Ошибка выхода',
    };
    const result = authReducer(stateWithUser, action);

    expect(result.loading).toBe('failed');
    expect(result.error).toBe('Ошибка выхода');
  });

  it('should handle getUser.fulfilled', () => {
    const statePending = { ...initialState, loading: 'pending' as const };
    const action = {
      type: getUser.fulfilled.type,
      payload: {
        success: true,
        user: mockUser,
      },
    };
    const result = authReducer(statePending, action);

    expect(result.loading).toBe('succeeded');
    expect(result.user).toEqual(mockUser);
    expect(result.isAuthenticated).toBe(true);
  });

  it('should handle getUser.rejected', () => {
    const stateWithUser = { ...initialState, user: mockUser, isAuthenticated: true, loading: 'pending' as const };
    const action = {
      type: getUser.rejected.type,
      payload: 'Ошибка получения данных',
    };
    const result = authReducer(stateWithUser, action);

    expect(result.loading).toBe('failed');
    expect(result.error).toBe('Ошибка получения данных');
    expect(result.user).toBeNull();
    expect(result.isAuthenticated).toBe(false);
  });

  it('should handle checkAuth.fulfilled with user', () => {
    const statePending = { ...initialState, loading: 'pending' as const };
    const action = {
      type: checkAuth.fulfilled.type,
      payload: mockUser,
    };
    const result = authReducer(statePending, action);

    expect(result.loading).toBe('succeeded');
    expect(result.user).toEqual(mockUser);
    expect(result.isAuthenticated).toBe(true);
  });

  it('should handle checkAuth.fulfilled with null', () => {
    const stateWithUser = { ...initialState, user: mockUser, isAuthenticated: true, loading: 'pending' as const };
    const action = {
      type: checkAuth.fulfilled.type,
      payload: null,
    };
    const result = authReducer(stateWithUser, action);

    expect(result.loading).toBe('succeeded');
    expect(result.user).toBeNull();
    expect(result.isAuthenticated).toBe(false);
  });

  it('should handle checkAuth.rejected', () => {
    const stateWithUser = { ...initialState, user: mockUser, isAuthenticated: true, loading: 'pending' as const };
    const action = { type: checkAuth.rejected.type };
    const result = authReducer(stateWithUser, action);

    expect(result.loading).toBe('succeeded');
    expect(result.user).toBeNull();
    expect(result.isAuthenticated).toBe(false);
  });

  it('should handle updateUser.fulfilled', () => {
    const stateWithUser = { ...initialState, user: mockUser, isAuthenticated: true, loading: 'pending' as const };
    const updatedUser: AuthUser = {
      email: 'updated@example.com',
      name: 'Updated User',
    };
    const action = {
      type: updateUser.fulfilled.type,
      payload: {
        success: true,
        user: updatedUser,
      },
    };
    const result = authReducer(stateWithUser, action);

    expect(result.loading).toBe('succeeded');
    expect(result.user).toEqual(updatedUser);
    expect(result.isAuthenticated).toBe(true);
  });

  it('should handle updateUser.rejected', () => {
    const stateWithUser = { ...initialState, user: mockUser, isAuthenticated: true, loading: 'pending' as const };
    const action = {
      type: updateUser.rejected.type,
      payload: 'Ошибка обновления',
    };
    const result = authReducer(stateWithUser, action);

    expect(result.loading).toBe('failed');
    expect(result.error).toBe('Ошибка обновления');
  });
});

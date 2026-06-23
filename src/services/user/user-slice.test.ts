import {
  checkUserAuth,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from './user-actions';
import { clearUserError, userSlice } from './user-slice';

import type { TUser } from '@utils/types';

const reducer = userSlice.reducer;

const mockUser: TUser = {
  email: 'test@test.com',
  name: 'Test User',
};

describe('userSlice', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      user: null,
      isAuthChecked: false,
      isLoading: false,
      error: null,
    });
  });

  it('should handle clearUserError', () => {
    const state = reducer(
      {
        user: mockUser,
        isAuthChecked: true,
        isLoading: false,
        error: 'Some error',
      },
      clearUserError()
    );

    expect(state.error).toBeNull();
  });

  describe('registerUser', () => {
    it('should handle pending', () => {
      const state = reducer(undefined, registerUser.pending('', mockUser));
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled', () => {
      const state = reducer(
        { user: null, isAuthChecked: false, isLoading: true, error: null },
        registerUser.fulfilled(mockUser, '', mockUser)
      );

      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
    });

    it('should handle rejected with payload', () => {
      const state = reducer(
        { user: null, isAuthChecked: false, isLoading: true, error: null },
        registerUser.rejected(null, '', mockUser, 'Register failed')
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Register failed');
    });

    it('should handle rejected without payload', () => {
      const state = reducer(
        { user: null, isAuthChecked: false, isLoading: true, error: null },
        registerUser.rejected(null, '', mockUser)
      );

      expect(state.error).toBe('Не удалось зарегистрироваться');
    });
  });

  describe('loginUser', () => {
    it('should handle pending', () => {
      const state = reducer(undefined, loginUser.pending('', mockUser));
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled', () => {
      const state = reducer(
        { user: null, isAuthChecked: false, isLoading: true, error: null },
        loginUser.fulfilled(mockUser, '', mockUser)
      );

      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
    });

    it('should handle rejected with payload', () => {
      const state = reducer(
        { user: null, isAuthChecked: false, isLoading: true, error: null },
        loginUser.rejected(null, '', mockUser, 'Login failed')
      );

      expect(state.error).toBe('Login failed');
    });

    it('should handle rejected without payload', () => {
      const state = reducer(
        { user: null, isAuthChecked: false, isLoading: true, error: null },
        loginUser.rejected(null, '', mockUser)
      );

      expect(state.error).toBe('Не удалось войти');
    });
  });

  describe('logoutUser', () => {
    it('should handle pending', () => {
      const state = reducer(undefined, logoutUser.pending('', undefined));
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled', () => {
      const state = reducer(
        { user: mockUser, isAuthChecked: true, isLoading: true, error: null },
        logoutUser.fulfilled(undefined, '', undefined)
      );

      expect(state.user).toBeNull();
      expect(state.isLoading).toBe(false);
    });

    it('should handle rejected', () => {
      const state = reducer(
        { user: mockUser, isAuthChecked: true, isLoading: true, error: null },
        logoutUser.rejected(null, '', undefined, 'Logout failed')
      );

      expect(state.user).toBeNull();
      expect(state.error).toBe('Logout failed');
    });
  });

  describe('checkUserAuth', () => {
    it('should handle pending', () => {
      const state = reducer(
        { user: mockUser, isAuthChecked: true, isLoading: false, error: null },
        checkUserAuth.pending('', undefined)
      );

      expect(state.isAuthChecked).toBe(false);
    });

    it('should handle fulfilled with user', () => {
      const state = reducer(
        { user: null, isAuthChecked: false, isLoading: false, error: null },
        checkUserAuth.fulfilled(mockUser, '', undefined)
      );

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
    });

    it('should handle fulfilled with null', () => {
      const state = reducer(
        { user: mockUser, isAuthChecked: false, isLoading: false, error: null },
        checkUserAuth.fulfilled(null, '', undefined)
      );

      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
    });

    it('should handle rejected', () => {
      const state = reducer(
        { user: mockUser, isAuthChecked: false, isLoading: false, error: null },
        checkUserAuth.rejected(null, '', undefined)
      );

      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('updateUser', () => {
    const updatePayload = {
      name: 'Updated',
      email: 'updated@test.com',
      password: 'password',
    };

    it('should handle pending', () => {
      const state = reducer(undefined, updateUser.pending('', updatePayload));
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled', () => {
      const updatedUser = { name: 'Updated', email: 'updated@test.com' };
      const state = reducer(
        { user: mockUser, isAuthChecked: true, isLoading: true, error: null },
        updateUser.fulfilled(updatedUser, '', updatePayload)
      );

      expect(state.user).toEqual(updatedUser);
      expect(state.isLoading).toBe(false);
    });

    it('should handle rejected with payload', () => {
      const state = reducer(
        { user: mockUser, isAuthChecked: true, isLoading: true, error: null },
        updateUser.rejected(null, '', updatePayload, 'Update failed')
      );

      expect(state.error).toBe('Update failed');
    });

    it('should handle rejected without payload', () => {
      const state = reducer(
        { user: mockUser, isAuthChecked: true, isLoading: true, error: null },
        updateUser.rejected(null, '', updatePayload)
      );

      expect(state.error).toBe('Не удалось обновить данные');
    });
  });
});

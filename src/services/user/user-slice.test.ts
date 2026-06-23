import {
  checkUserAuth,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from './user-actions';
import { clearUserError, initialState, userSlice } from './user-slice';

import type { TUser } from '@utils/types';

const reducer = userSlice.reducer;

const mockUser: TUser = {
  email: 'test@test.com',
  name: 'Test User',
};

describe('userSlice', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle clearUserError', () => {
    const state = reducer(
      {
        ...initialState,
        user: mockUser,
        isAuthChecked: true,
        error: 'Some error',
      },
      clearUserError()
    );

    expect(state.error).toBeNull();
  });

  describe('registerUser', () => {
    it('should handle pending', () => {
      const state = reducer(initialState, registerUser.pending('', mockUser));
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled', () => {
      const state = reducer(
        { ...initialState, isLoading: true },
        registerUser.fulfilled(mockUser, '', mockUser)
      );

      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
    });

    it('should handle rejected with payload', () => {
      const state = reducer(
        { ...initialState, isLoading: true },
        registerUser.rejected(null, '', mockUser, 'Register failed')
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Register failed');
    });

    it('should handle rejected without payload', () => {
      const state = reducer(
        { ...initialState, isLoading: true },
        registerUser.rejected(null, '', mockUser)
      );

      expect(state.error).toBe('Не удалось зарегистрироваться');
    });
  });

  describe('loginUser', () => {
    it('should handle pending', () => {
      const state = reducer(initialState, loginUser.pending('', mockUser));
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled', () => {
      const state = reducer(
        { ...initialState, isLoading: true },
        loginUser.fulfilled(mockUser, '', mockUser)
      );

      expect(state.user).toEqual(mockUser);
      expect(state.isLoading).toBe(false);
    });

    it('should handle rejected with payload', () => {
      const state = reducer(
        { ...initialState, isLoading: true },
        loginUser.rejected(null, '', mockUser, 'Login failed')
      );

      expect(state.error).toBe('Login failed');
    });

    it('should handle rejected without payload', () => {
      const state = reducer(
        { ...initialState, isLoading: true },
        loginUser.rejected(null, '', mockUser)
      );

      expect(state.error).toBe('Не удалось войти');
    });
  });

  describe('logoutUser', () => {
    it('should handle pending', () => {
      const state = reducer(initialState, logoutUser.pending('', undefined));
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled', () => {
      const state = reducer(
        { ...initialState, user: mockUser, isAuthChecked: true, isLoading: true },
        logoutUser.fulfilled(undefined, '', undefined)
      );

      expect(state.user).toBeNull();
      expect(state.isLoading).toBe(false);
    });

    it('should handle rejected', () => {
      const state = reducer(
        { ...initialState, user: mockUser, isAuthChecked: true, isLoading: true },
        logoutUser.rejected(null, '', undefined, 'Logout failed')
      );

      expect(state.user).toBeNull();
      expect(state.error).toBe('Logout failed');
    });
  });

  describe('checkUserAuth', () => {
    it('should handle pending', () => {
      const state = reducer(
        { ...initialState, user: mockUser, isAuthChecked: true },
        checkUserAuth.pending('', undefined)
      );

      expect(state.isAuthChecked).toBe(false);
    });

    it('should handle fulfilled with user', () => {
      const state = reducer(
        initialState,
        checkUserAuth.fulfilled(mockUser, '', undefined)
      );

      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
    });

    it('should handle fulfilled with null', () => {
      const state = reducer(
        { ...initialState, user: mockUser },
        checkUserAuth.fulfilled(null, '', undefined)
      );

      expect(state.user).toBeNull();
      expect(state.isAuthChecked).toBe(true);
    });

    it('should handle rejected', () => {
      const state = reducer(
        { ...initialState, user: mockUser },
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
      const state = reducer(initialState, updateUser.pending('', updatePayload));
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled', () => {
      const updatedUser = { name: 'Updated', email: 'updated@test.com' };
      const state = reducer(
        { ...initialState, user: mockUser, isAuthChecked: true, isLoading: true },
        updateUser.fulfilled(updatedUser, '', updatePayload)
      );

      expect(state.user).toEqual(updatedUser);
      expect(state.isLoading).toBe(false);
    });

    it('should handle rejected with payload', () => {
      const state = reducer(
        { ...initialState, user: mockUser, isAuthChecked: true, isLoading: true },
        updateUser.rejected(null, '', updatePayload, 'Update failed')
      );

      expect(state.error).toBe('Update failed');
    });

    it('should handle rejected without payload', () => {
      const state = reducer(
        { ...initialState, user: mockUser, isAuthChecked: true, isLoading: true },
        updateUser.rejected(null, '', updatePayload)
      );

      expect(state.error).toBe('Не удалось обновить данные');
    });
  });
});

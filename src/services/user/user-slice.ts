import { createSlice } from '@reduxjs/toolkit';

import {
  checkUserAuth,
  loginUser,
  logoutUser,
  registerUser,
  updateUser,
} from './user-actions';

import type { TUser } from '@utils/types';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const setPending = (state: TUserState): void => {
      state.isLoading = true;
      state.error = null;
    };

    const setRejected = (state: TUserState, message: string): void => {
      state.isLoading = false;
      state.error = message;
    };

    builder
      .addCase(registerUser.pending, setPending)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        setRejected(
          state,
          typeof action.payload === 'string'
            ? action.payload
            : 'Не удалось зарегистрироваться'
        );
      })
      .addCase(loginUser.pending, setPending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        setRejected(
          state,
          typeof action.payload === 'string' ? action.payload : 'Не удалось войти'
        );
      })
      .addCase(logoutUser.pending, setPending)
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error =
          typeof action.payload === 'string' ? action.payload : 'Не удалось выйти';
      })
      .addCase(checkUserAuth.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.user = null;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.pending, setPending)
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        setRejected(
          state,
          typeof action.payload === 'string'
            ? action.payload
            : 'Не удалось обновить данные'
        );
      });
  },
});

export const { clearUserError } = userSlice.actions;

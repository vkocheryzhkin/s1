import { createAsyncThunk } from '@reduxjs/toolkit';

import { fetchWithRefresh } from '@utils/fetch-with-refresh';
import { request } from '@utils/request';
import { clearTokens, getAccessToken, setTokens } from '@utils/token';

import type {
  TAuthResponse,
  TLoginRequest,
  TMessageResponse,
  TRegisterRequest,
  TUpdateUserRequest,
  TUser,
  TUserResponse,
} from '@utils/types';

export const registerUser = createAsyncThunk<TUser, TRegisterRequest>(
  'user/register',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await request<TAuthResponse>('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!data.success) {
        throw new Error('Не удалось зарегистрироваться');
      }

      setTokens(data.accessToken, data.refreshToken);

      return data.user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось зарегистрироваться'
      );
    }
  }
);

export const loginUser = createAsyncThunk<TUser, TLoginRequest>(
  'user/login',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await request<TAuthResponse>('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!data.success) {
        throw new Error('Не удалось войти');
      }

      setTokens(data.accessToken, data.refreshToken);

      return data.user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось войти'
      );
    }
  }
);

export const logoutUser = createAsyncThunk<void, void>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await request<TMessageResponse>('/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: localStorage.getItem('refreshToken') }),
      });

      clearTokens();
    } catch (error) {
      clearTokens();
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось выйти'
      );
    }
  }
);

export const checkUserAuth = createAsyncThunk<TUser | null, void>(
  'user/checkUserAuth',
  async () => {
    if (!getAccessToken()) {
      return null;
    }

    try {
      const data = await fetchWithRefresh<TUserResponse>('/auth/user');

      if (!data.success) {
        clearTokens();
        return null;
      }

      return data.user;
    } catch {
      clearTokens();
      return null;
    }
  }
);

export const updateUser = createAsyncThunk<TUser, TUpdateUserRequest>(
  'user/updateUser',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await fetchWithRefresh<TUserResponse>('/auth/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!data.success) {
        throw new Error('Не удалось обновить данные');
      }

      return data.user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось обновить данные'
      );
    }
  }
);

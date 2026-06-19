import { API_URL } from './constants';
import { checkResponse } from './request';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from './token';

import type { TTokenResponse } from './types';

const refreshTokenRequest = async (): Promise<TTokenResponse> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('Refresh token not found');
  }

  const response = await fetch(`${API_URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: refreshToken }),
  });

  const data = await checkResponse<TTokenResponse>(response);

  if (!data.success) {
    throw new Error('Failed to refresh token');
  }

  setTokens(data.accessToken, data.refreshToken);

  return data;
};

export const fetchWithRefresh = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const accessToken = getAccessToken();

  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...options.headers,
      authorization: accessToken ?? '',
    },
  };

  const response = await fetch(`${API_URL}${endpoint}`, requestOptions);

  if (response.ok) {
    return checkResponse<T>(response);
  }

  let errorData: { message?: string } = {};

  try {
    errorData = (await response.json()) as { message?: string };
  } catch {
    throw new Error(`Ошибка запроса: ${response.status}`);
  }

  if (errorData.message === 'jwt expired') {
    await refreshTokenRequest();

    const retryResponse = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...options.headers,
        authorization: getAccessToken() ?? '',
      },
    });

    return checkResponse<T>(retryResponse);
  }

  clearTokens();
  throw new Error(errorData.message ?? `Ошибка запроса: ${response.status}`);
};

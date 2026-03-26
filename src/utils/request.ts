import { API_URL } from './constants';

export const checkResponse = async <T>(res: Response): Promise<T> => {
  if (!res.ok) {
    throw new Error(`Ошибка запроса: ${res.status}`);
  }

  return (await res.json()) as T;
};

export const request = <T>(endpoint: string, options?: RequestInit): Promise<T> =>
  fetch(`${API_URL}${endpoint}`, options).then(checkResponse<T>);

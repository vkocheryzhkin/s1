import { createAsyncThunk } from '@reduxjs/toolkit';

import { fetchWithRefresh } from '@utils/fetch-with-refresh';

import type { TCreateOrderRequest, TCreateOrderResponse } from '@utils/types';

export const createOrder = createAsyncThunk<number, TCreateOrderRequest>(
  'order/createOrder',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await fetchWithRefresh<TCreateOrderResponse>('/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!data.success) {
        throw new Error('Некорректный ответ от сервера');
      }

      return data.order.number;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось оформить заказ'
      );
    }
  }
);

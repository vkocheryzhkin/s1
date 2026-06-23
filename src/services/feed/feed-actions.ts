import { createAsyncThunk } from '@reduxjs/toolkit';

import { request } from '@utils/request';

import type { TOrder, TOrderByNumberResponse } from '@utils/types';

export const fetchFeedOrderByNumber = createAsyncThunk<TOrder, number>(
  'feed/fetchOrderByNumber',
  async (number, { rejectWithValue }) => {
    try {
      const data = await request<TOrderByNumberResponse>(`/orders/${number}`);

      if (!data.success || !data.orders[0]) {
        throw new Error('Заказ не найден');
      }

      return data.orders[0];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось загрузить заказ'
      );
    }
  }
);

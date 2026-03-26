import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { API_URL } from '@utils/constants';

import type { TCreateOrderRequest, TCreateOrderResponse } from '@utils/types';

type TOrderState = {
  number: number | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  number: null,
  isLoading: false,
  error: null,
};

export const createOrder = createAsyncThunk<number, TCreateOrderRequest>(
  'order/createOrder',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Ошибка оформления заказа: ${response.status}`);
      }

      const data = (await response.json()) as TCreateOrderResponse;

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

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.number = null;
      state.error = null;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.number = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Не удалось оформить заказ';
      });
  },
});

export const { clearOrder } = orderSlice.actions;

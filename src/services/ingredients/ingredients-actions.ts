import { createAsyncThunk } from '@reduxjs/toolkit';

import { request } from '@utils/request';

import type { TIngredient, TIngredientsResponse } from '@utils/types';

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const data = await request<TIngredientsResponse>('/ingredients');

      if (!data.success || !Array.isArray(data.data)) {
        throw new Error('Некорректный ответ от сервера');
      }

      return data.data;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось загрузить ингредиенты'
      );
    }
  }
);

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { API_URL } from '@utils/constants';

import type { TIngredient, TIngredientsResponse } from '@utils/types';

type TIngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  items: [],
  isLoading: false,
  error: null,
};

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/ingredients`);

      if (!response.ok) {
        throw new Error(`Ошибка загрузки ингредиентов: ${response.status}`);
      }

      const data = (await response.json()) as TIngredientsResponse;

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

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Не удалось загрузить ингредиенты';
      });
  },
});

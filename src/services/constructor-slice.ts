import { createSlice } from '@reduxjs/toolkit';

import { fetchIngredients } from './ingredients-slice';

import type { TIngredient } from '@utils/types';

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: [],
};

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchIngredients.fulfilled, (state, action) => {
      const bun = action.payload.find((ingredient) => ingredient.type === 'bun') ?? null;
      const ingredients = action.payload
        .filter((ingredient) => ingredient.type !== 'bun')
        .slice(0, 4);

      state.bun = bun;
      state.ingredients = ingredients;
    });
  },
});

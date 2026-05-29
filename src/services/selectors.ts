import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from './store';
import type { TConstructorIngredient, TIngredient } from '@utils/types';

const selectConstructorBun = (state: RootState): TIngredient | null =>
  state.burgerConstructor.bun;
const selectConstructorIngredients = (state: RootState): TConstructorIngredient[] =>
  state.burgerConstructor.ingredients;

export const selectIngredientCounters = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, ingredients): Record<string, number> => {
    const counters: Record<string, number> = {};

    if (bun) {
      counters[bun._id] = 2;
    }

    for (const ingredient of ingredients) {
      counters[ingredient._id] = (counters[ingredient._id] ?? 0) + 1;
    }

    return counters;
  }
);

export const selectOrderPrice = createSelector(
  [selectConstructorBun, selectConstructorIngredients],
  (bun, ingredients): number => {
    const ingredientsPrice = ingredients.reduce(
      (sum, ingredient) => sum + ingredient.calories,
      0
    );

    return bun ? ingredientsPrice + bun.calories * 2 : ingredientsPrice;
  }
);

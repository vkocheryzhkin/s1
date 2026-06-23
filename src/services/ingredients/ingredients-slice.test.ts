import { fetchIngredients } from './ingredients-actions';
import { initialState, ingredientsSlice } from './ingredients-slice';

import type { TIngredient } from '@utils/types';

const reducer = ingredientsSlice.reducer;

const mockIngredients: TIngredient[] = [
  {
    _id: 'bun-1',
    name: 'Bun',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 100,
    price: 50,
    image: 'image.png',
    image_large: 'image_large.png',
    image_mobile: 'image_mobile.png',
    __v: 0,
  },
];

describe('ingredientsSlice', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle fetchIngredients.pending', () => {
    const state = reducer(
      { ...initialState, items: mockIngredients, error: 'old error' },
      fetchIngredients.pending('', undefined)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchIngredients.fulfilled', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      fetchIngredients.fulfilled(mockIngredients, '', undefined)
    );

    expect(state.items).toEqual(mockIngredients);
    expect(state.isLoading).toBe(false);
  });

  it('should handle fetchIngredients.rejected with payload', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      fetchIngredients.rejected(null, '', undefined, 'Custom error')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Custom error');
  });

  it('should handle fetchIngredients.rejected without payload', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      fetchIngredients.rejected(null, '', undefined)
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Не удалось загрузить ингредиенты');
  });
});

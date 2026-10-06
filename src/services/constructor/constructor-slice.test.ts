import {
  addIngredient,
  constructorSlice,
  initialState,
  moveIngredient,
  removeIngredient,
} from './constructor-slice';

import type { TConstructorIngredient, TIngredient } from '@utils/types';

const reducer = constructorSlice.reducer;

const createIngredient = (overrides: Partial<TIngredient> = {}): TIngredient => ({
  _id: 'ingredient-id',
  name: 'Test ingredient',
  type: 'main',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 100,
  price: 50,
  image: 'image.png',
  image_large: 'image_large.png',
  image_mobile: 'image_mobile.png',
  __v: 0,
  ...overrides,
});

const createConstructorIngredient = (
  overrides: Partial<TConstructorIngredient> = {}
): TConstructorIngredient => ({
  ...createIngredient(),
  uuid: 'uuid-1',
  ...overrides,
});

describe('constructorSlice', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('addIngredient', () => {
    it('should set bun when ingredient type is bun', () => {
      const bun = createIngredient({ _id: 'bun-id', type: 'bun', name: 'Bun' });
      const state = reducer(initialState, addIngredient(bun));

      expect(state.bun).toMatchObject({ _id: 'bun-id', type: 'bun' });
      expect(state.bun?.uuid).toBeTruthy();
      expect(state.ingredients).toEqual([]);
    });

    it('should replace existing bun', () => {
      const firstBun = createIngredient({ _id: 'bun-1', type: 'bun' });
      const secondBun = createIngredient({ _id: 'bun-2', type: 'bun' });
      const stateWithFirstBun = reducer(initialState, addIngredient(firstBun));
      const state = reducer(stateWithFirstBun, addIngredient(secondBun));

      expect(state.bun?._id).toBe('bun-2');
    });

    it('should add filling ingredient to list', () => {
      const filling = createIngredient({ _id: 'main-id', type: 'main' });
      const state = reducer(initialState, addIngredient(filling));

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toMatchObject({ _id: 'main-id', type: 'main' });
      expect(state.ingredients[0].uuid).toBeTruthy();
    });
  });

  describe('removeIngredient', () => {
    it('should remove ingredient by uuid', () => {
      const first = createConstructorIngredient({ uuid: 'uuid-1', _id: 'first' });
      const second = createConstructorIngredient({ uuid: 'uuid-2', _id: 'second' });
      const stateWithIngredients = {
        ...initialState,
        ingredients: [first, second],
      };
      const state = reducer(stateWithIngredients, removeIngredient('uuid-1'));

      expect(state.ingredients).toEqual([second]);
    });
  });

  describe('moveIngredient', () => {
    const ingredients = [
      createConstructorIngredient({ uuid: 'uuid-1', name: 'First' }),
      createConstructorIngredient({ uuid: 'uuid-2', name: 'Second' }),
      createConstructorIngredient({ uuid: 'uuid-3', name: 'Third' }),
    ];
    const stateWithIngredients = { ...initialState, ingredients };

    it('should move ingredient from one index to another', () => {
      const state = reducer(
        stateWithIngredients,
        moveIngredient({ fromIndex: 0, toIndex: 2 })
      );

      expect(state.ingredients.map((item) => item.uuid)).toEqual([
        'uuid-2',
        'uuid-3',
        'uuid-1',
      ]);
    });

    it('should not change state for invalid indices', () => {
      const invalidMoves = [
        { fromIndex: -1, toIndex: 0 },
        { fromIndex: 0, toIndex: -1 },
        { fromIndex: 0, toIndex: 3 },
        { fromIndex: 3, toIndex: 0 },
        { fromIndex: 1, toIndex: 1 },
      ];

      invalidMoves.forEach((payload) => {
        const state = reducer(stateWithIngredients, moveIngredient(payload));
        expect(state.ingredients).toEqual(stateWithIngredients.ingredients);
      });
    });
  });
});

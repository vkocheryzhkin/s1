import { configureStore } from '@reduxjs/toolkit';

import { burgerApi } from './burger-api';
import { selectedIngredientSlice } from './selected-ingredient-slice';

export const store = configureStore({
  reducer: {
    selectedIngredient: selectedIngredientSlice.reducer,
    [burgerApi.reducerPath]: burgerApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(burgerApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

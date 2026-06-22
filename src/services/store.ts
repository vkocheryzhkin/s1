import { configureStore } from '@reduxjs/toolkit';

import { constructorSlice } from './constructor-slice';
import { ingredientsSlice } from './ingredients-slice';
import { orderSlice } from './order-slice';
import { userSlice } from './user-slice';

export const store = configureStore({
  reducer: {
    burgerConstructor: constructorSlice.reducer,
    ingredients: ingredientsSlice.reducer,
    order: orderSlice.reducer,
    user: userSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

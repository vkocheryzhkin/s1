import { configureStore } from '@reduxjs/toolkit';

import { constructorSlice } from './constructor-slice';
import { feedMiddleware, feedSlice } from './feed-slice';
import { ingredientsSlice } from './ingredients-slice';
import { orderSlice } from './order-slice';
import { profileOrdersMiddleware, profileOrdersSlice } from './profile-orders-slice';
import { userSlice } from './user-slice';

export const store = configureStore({
  reducer: {
    burgerConstructor: constructorSlice.reducer,
    ingredients: ingredientsSlice.reducer,
    order: orderSlice.reducer,
    user: userSlice.reducer,
    feed: feedSlice.reducer,
    profileOrders: profileOrdersSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(feedMiddleware, profileOrdersMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

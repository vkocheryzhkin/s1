import { createSlice } from '@reduxjs/toolkit';

import { socketMiddleware } from '@services/middleware/socket-middleware';
import { WS_FEED_URL } from '@utils/constants';
import { isValidOrder } from '@utils/order';

import { fetchFeedOrderByNumber } from './feed-actions';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@services/store';
import type { TOrder, TOrdersResponse } from '@utils/types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
  currentOrder: TOrder | null;
  isCurrentOrderLoading: boolean;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  currentOrder: null,
  isCurrentOrderLoading: false,
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    wsConnecting: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    wsOpen: (state) => {
      state.isLoading = false;
    },
    wsClose: (state) => {
      state.isLoading = false;
    },
    wsError: (state) => {
      state.error = 'Ошибка соединения с сервером';
      state.isLoading = false;
    },
    wsMessage: (state, action: PayloadAction<TOrdersResponse>) => {
      if (!action.payload.success) {
        return;
      }

      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    },
    wsDisconnect: (state) => state,
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedOrderByNumber.pending, (state) => {
        state.isCurrentOrderLoading = true;
      })
      .addCase(fetchFeedOrderByNumber.fulfilled, (state, action) => {
        state.isCurrentOrderLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchFeedOrderByNumber.rejected, (state) => {
        state.isCurrentOrderLoading = false;
        state.currentOrder = null;
      });
  },
});

export const feedWsActions = {
  connecting: feedSlice.actions.wsConnecting.type,
  open: feedSlice.actions.wsOpen.type,
  close: feedSlice.actions.wsClose.type,
  error: feedSlice.actions.wsError.type,
  message: feedSlice.actions.wsMessage.type,
  disconnect: feedSlice.actions.wsDisconnect.type,
};

export const feedMiddleware = socketMiddleware(WS_FEED_URL, feedWsActions);

export const {
  wsConnecting: connectFeed,
  wsDisconnect: disconnectFeed,
  clearCurrentOrder: clearFeedCurrentOrder,
} = feedSlice.actions;

export const selectFeedOrders = (state: RootState): TOrder[] => {
  const ingredientsMap = new Map(
    state.ingredients.items.map((item) => [item._id, item])
  );

  return state.feed.orders.filter((order) => isValidOrder(order, ingredientsMap));
};

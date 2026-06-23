import { createSlice } from '@reduxjs/toolkit';

import { socketMiddleware } from '@services/middleware/socket-middleware';
import { logoutUser } from '@services/user/user-actions';
import { WS_URL } from '@utils/constants';
import { refreshAccessToken } from '@utils/fetch-with-refresh';
import { isValidOrder } from '@utils/order';
import { getWsAccessToken } from '@utils/token';

import { fetchProfileOrderByNumber } from './profile-orders-actions';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppDispatch, RootState } from '@services/store';
import type { TOrder, TOrdersResponse } from '@utils/types';

type TProfileOrdersState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
  currentOrder: TOrder | null;
  isCurrentOrderLoading: boolean;
};

export const initialState: TProfileOrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  currentOrder: null,
  isCurrentOrderLoading: false,
};

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
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
      .addCase(fetchProfileOrderByNumber.pending, (state) => {
        state.isCurrentOrderLoading = true;
      })
      .addCase(fetchProfileOrderByNumber.fulfilled, (state, action) => {
        state.isCurrentOrderLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchProfileOrderByNumber.rejected, (state) => {
        state.isCurrentOrderLoading = false;
        state.currentOrder = null;
      });
  },
});

export const profileOrdersWsActions = {
  connecting: profileOrdersSlice.actions.wsConnecting.type,
  open: profileOrdersSlice.actions.wsOpen.type,
  close: profileOrdersSlice.actions.wsClose.type,
  error: profileOrdersSlice.actions.wsError.type,
  message: profileOrdersSlice.actions.wsMessage.type,
  disconnect: profileOrdersSlice.actions.wsDisconnect.type,
};

export const profileOrdersMiddleware = socketMiddleware(
  () => {
    const token = getWsAccessToken();
    return token ? `${WS_URL}?token=${token}` : WS_URL;
  },
  profileOrdersWsActions,
  {
    onInvalidToken: (dispatch) => {
      void refreshAccessToken()
        .then(() => {
          dispatch(connectProfileOrders());
        })
        .catch(() => {
          void (dispatch as AppDispatch)(logoutUser());
        });
    },
  }
);

export const {
  wsConnecting: connectProfileOrders,
  wsDisconnect: disconnectProfileOrders,
  clearCurrentOrder: clearProfileCurrentOrder,
} = profileOrdersSlice.actions;

export const selectProfileOrders = (state: RootState): TOrder[] => {
  const ingredientsMap = new Map(
    state.ingredients.items.map((item) => [item._id, item])
  );

  return state.profileOrders.orders.filter((order) =>
    isValidOrder(order, ingredientsMap)
  );
};

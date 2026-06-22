import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { WS_URL } from '@utils/constants';
import { isValidOrder } from '@utils/order';
import { request } from '@utils/request';
import { getAccessToken } from '@utils/token';

import { socketMiddleware } from './socket-middleware';
import { logoutUser } from './user-slice';

import type { AppDispatch, RootState } from './store';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { TOrder, TOrderByNumberResponse, TOrdersResponse } from '@utils/types';

type TProfileOrdersState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
  currentOrder: TOrder | null;
  isCurrentOrderLoading: boolean;
};

const initialState: TProfileOrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null,
  currentOrder: null,
  isCurrentOrderLoading: false,
};

export const fetchProfileOrderByNumber = createAsyncThunk<TOrder, number>(
  'profileOrders/fetchOrderByNumber',
  async (number, { rejectWithValue }) => {
    try {
      const data = await request<TOrderByNumberResponse>(`/orders/${number}`);

      if (!data.success || !data.orders[0]) {
        throw new Error('Заказ не найден');
      }

      return data.orders[0];
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось загрузить заказ'
      );
    }
  }
);

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
  () => `${WS_URL}?token=${getAccessToken() ?? ''}`,
  profileOrdersWsActions,
  {
    onInvalidToken: (dispatch) => {
      void (dispatch as AppDispatch)(logoutUser());
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

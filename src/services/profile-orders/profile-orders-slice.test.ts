import { fetchProfileOrderByNumber } from './profile-orders-actions';
import {
  clearProfileCurrentOrder,
  connectProfileOrders,
  disconnectProfileOrders,
  profileOrdersSlice,
} from './profile-orders-slice';

import type { TOrder, TOrdersResponse } from '@utils/types';

const reducer = profileOrdersSlice.reducer;

const mockOrder: TOrder = {
  _id: 'order-1',
  ingredients: ['bun-1', 'main-1', 'bun-1'],
  status: 'done',
  name: 'Space burger',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  number: 54321,
};

const mockOrdersResponse: TOrdersResponse = {
  success: true,
  orders: [mockOrder],
  total: 200,
  totalToday: 20,
};

describe('profileOrdersSlice', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      isLoading: false,
      error: null,
      currentOrder: null,
      isCurrentOrderLoading: false,
    });
  });

  it('should handle wsConnecting', () => {
    const state = reducer(
      { ...reducer(undefined, { type: 'unknown' }), error: 'old error' },
      connectProfileOrders()
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle wsOpen', () => {
    const state = reducer(
      { ...reducer(undefined, { type: 'unknown' }), isLoading: true },
      profileOrdersSlice.actions.wsOpen()
    );

    expect(state.isLoading).toBe(false);
  });

  it('should handle wsClose', () => {
    const state = reducer(
      { ...reducer(undefined, { type: 'unknown' }), isLoading: true },
      profileOrdersSlice.actions.wsClose()
    );

    expect(state.isLoading).toBe(false);
  });

  it('should handle wsError', () => {
    const state = reducer(undefined, profileOrdersSlice.actions.wsError());

    expect(state.error).toBe('Ошибка соединения с сервером');
    expect(state.isLoading).toBe(false);
  });

  it('should handle wsMessage with success response', () => {
    const state = reducer(
      undefined,
      profileOrdersSlice.actions.wsMessage(mockOrdersResponse)
    );

    expect(state.orders).toEqual(mockOrdersResponse.orders);
    expect(state.total).toBe(200);
    expect(state.totalToday).toBe(20);
  });

  it('should ignore wsMessage when success is false', () => {
    const initialState = {
      ...reducer(undefined, { type: 'unknown' }),
      orders: [mockOrder],
      total: 50,
      totalToday: 5,
    };
    const state = reducer(
      initialState,
      profileOrdersSlice.actions.wsMessage({
        success: false,
        orders: [],
        total: 0,
        totalToday: 0,
      })
    );

    expect(state.orders).toEqual(initialState.orders);
    expect(state.total).toBe(50);
    expect(state.totalToday).toBe(5);
  });

  it('should handle wsDisconnect', () => {
    const initialState = reducer(
      undefined,
      profileOrdersSlice.actions.wsMessage(mockOrdersResponse)
    );
    const state = reducer(initialState, disconnectProfileOrders());

    expect(state).toEqual(initialState);
  });

  it('should handle clearCurrentOrder', () => {
    const state = reducer(
      { ...reducer(undefined, { type: 'unknown' }), currentOrder: mockOrder },
      clearProfileCurrentOrder()
    );

    expect(state.currentOrder).toBeNull();
  });

  it('should handle fetchProfileOrderByNumber.pending', () => {
    const state = reducer(
      reducer(undefined, { type: 'unknown' }),
      fetchProfileOrderByNumber.pending('', 54321)
    );

    expect(state.isCurrentOrderLoading).toBe(true);
  });

  it('should handle fetchProfileOrderByNumber.fulfilled', () => {
    const state = reducer(
      { ...reducer(undefined, { type: 'unknown' }), isCurrentOrderLoading: true },
      fetchProfileOrderByNumber.fulfilled(mockOrder, '', 54321)
    );

    expect(state.isCurrentOrderLoading).toBe(false);
    expect(state.currentOrder).toEqual(mockOrder);
  });

  it('should handle fetchProfileOrderByNumber.rejected', () => {
    const state = reducer(
      {
        ...reducer(undefined, { type: 'unknown' }),
        isCurrentOrderLoading: true,
        currentOrder: mockOrder,
      },
      fetchProfileOrderByNumber.rejected(null, '', 54321)
    );

    expect(state.isCurrentOrderLoading).toBe(false);
    expect(state.currentOrder).toBeNull();
  });
});

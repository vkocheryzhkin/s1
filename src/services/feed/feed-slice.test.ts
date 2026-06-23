import { fetchFeedOrderByNumber } from './feed-actions';
import {
  clearFeedCurrentOrder,
  connectFeed,
  disconnectFeed,
  feedSlice,
  initialState,
} from './feed-slice';

import type { TOrder, TOrdersResponse } from '@utils/types';

const reducer = feedSlice.reducer;

const mockOrder: TOrder = {
  _id: 'order-1',
  ingredients: ['bun-1', 'main-1', 'bun-1'],
  status: 'done',
  name: 'Space burger',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  number: 12345,
};

const mockOrdersResponse: TOrdersResponse = {
  success: true,
  orders: [mockOrder],
  total: 100,
  totalToday: 10,
};

describe('feedSlice', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle wsConnecting', () => {
    const state = reducer({ ...initialState, error: 'old error' }, connectFeed());

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle wsOpen', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      feedSlice.actions.wsOpen()
    );

    expect(state.isLoading).toBe(false);
  });

  it('should handle wsClose', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      feedSlice.actions.wsClose()
    );

    expect(state.isLoading).toBe(false);
  });

  it('should handle wsError', () => {
    const state = reducer(initialState, feedSlice.actions.wsError());

    expect(state.error).toBe('Ошибка соединения с сервером');
    expect(state.isLoading).toBe(false);
  });

  it('should handle wsMessage with success response', () => {
    const state = reducer(initialState, feedSlice.actions.wsMessage(mockOrdersResponse));

    expect(state.orders).toEqual(mockOrdersResponse.orders);
    expect(state.total).toBe(100);
    expect(state.totalToday).toBe(10);
  });

  it('should ignore wsMessage when success is false', () => {
    const stateWithOrders = {
      ...initialState,
      orders: [mockOrder],
      total: 50,
      totalToday: 5,
    };
    const state = reducer(
      stateWithOrders,
      feedSlice.actions.wsMessage({
        success: false,
        orders: [],
        total: 0,
        totalToday: 0,
      })
    );

    expect(state.orders).toEqual(stateWithOrders.orders);
    expect(state.total).toBe(50);
    expect(state.totalToday).toBe(5);
  });

  it('should handle wsDisconnect', () => {
    const stateWithOrders = reducer(
      initialState,
      feedSlice.actions.wsMessage(mockOrdersResponse)
    );
    const state = reducer(stateWithOrders, disconnectFeed());

    expect(state).toEqual(stateWithOrders);
  });

  it('should handle clearCurrentOrder', () => {
    const state = reducer(
      { ...initialState, currentOrder: mockOrder },
      clearFeedCurrentOrder()
    );

    expect(state.currentOrder).toBeNull();
  });

  it('should handle fetchFeedOrderByNumber.pending', () => {
    const state = reducer(initialState, fetchFeedOrderByNumber.pending('', 12345));

    expect(state.isCurrentOrderLoading).toBe(true);
  });

  it('should handle fetchFeedOrderByNumber.fulfilled', () => {
    const state = reducer(
      { ...initialState, isCurrentOrderLoading: true },
      fetchFeedOrderByNumber.fulfilled(mockOrder, '', 12345)
    );

    expect(state.isCurrentOrderLoading).toBe(false);
    expect(state.currentOrder).toEqual(mockOrder);
  });

  it('should handle fetchFeedOrderByNumber.rejected', () => {
    const state = reducer(
      {
        ...initialState,
        isCurrentOrderLoading: true,
        currentOrder: mockOrder,
      },
      fetchFeedOrderByNumber.rejected(null, '', 12345)
    );

    expect(state.isCurrentOrderLoading).toBe(false);
    expect(state.currentOrder).toBeNull();
  });
});

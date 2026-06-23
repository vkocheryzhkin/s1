import { createOrder } from './order-actions';
import { clearOrder, orderSlice } from './order-slice';

const reducer = orderSlice.reducer;

describe('orderSlice', () => {
  it('should return initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      number: null,
      isLoading: false,
      error: null,
    });
  });

  it('should handle clearOrder', () => {
    const state = reducer(
      { number: 12345, isLoading: true, error: 'error' },
      clearOrder()
    );

    expect(state).toEqual({
      number: null,
      isLoading: false,
      error: null,
    });
  });

  it('should handle createOrder.pending', () => {
    const state = reducer(
      { number: 1, isLoading: false, error: 'old error' },
      createOrder.pending('', { ingredients: ['id'] })
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle createOrder.fulfilled', () => {
    const state = reducer(
      { number: null, isLoading: true, error: null },
      createOrder.fulfilled(98765, '', { ingredients: ['id'] })
    );

    expect(state.number).toBe(98765);
    expect(state.isLoading).toBe(false);
  });

  it('should handle createOrder.rejected with payload', () => {
    const state = reducer(
      { number: null, isLoading: true, error: null },
      createOrder.rejected(null, '', { ingredients: ['id'] }, 'Order failed')
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Order failed');
  });

  it('should handle createOrder.rejected without payload', () => {
    const state = reducer(
      { number: null, isLoading: true, error: null },
      createOrder.rejected(null, '', { ingredients: ['id'] })
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Не удалось оформить заказ');
  });
});

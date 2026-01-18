import { orderReducer, createOrder, initialState } from './orderSlice';

describe('orderReducer', () => {
  it('should return initial state', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle createOrder.pending', () => {
    const action = { type: createOrder.pending.type };
    const result = orderReducer(initialState, action);
    
    expect(result.loading).toBe('pending');
    expect(result.error).toBeNull();
    expect(result.number).toBeNull();
  });

  it('should handle createOrder.fulfilled', () => {
    const statePending = { ...initialState, loading: 'pending' as const };
    const orderNumber = 12345;
    const action = {
      type: createOrder.fulfilled.type,
      payload: orderNumber,
    };
    const result = orderReducer(statePending, action);
    
    expect(result.loading).toBe('succeeded');
    expect(result.number).toBe(orderNumber);
    expect(result.error).toBeNull();
  });

  it('should handle createOrder.rejected', () => {
    const statePending = { ...initialState, loading: 'pending' as const };
    const action = {
      type: createOrder.rejected.type,
      payload: 'Ошибка создания заказа',
    };
    const result = orderReducer(statePending, action);
    
    expect(result.loading).toBe('failed');
    expect(result.error).toBe('Ошибка создания заказа');
    expect(result.number).toBeNull();
  });

  it('should handle createOrder.rejected with error message', () => {
    const statePending = { ...initialState, loading: 'pending' as const };
    const action = {
      type: createOrder.rejected.type,
      error: { message: 'Network error' },
    };
    const result = orderReducer(statePending, action);
    
    expect(result.loading).toBe('failed');
    expect(result.error).toBe('Network error');
  });

  it('should clear error on pending', () => {
    const stateWithError = {
      ...initialState,
      number: 12345,
      loading: 'failed' as const,
      error: 'Previous error',
    };
    const action = { type: createOrder.pending.type };
    const result = orderReducer(stateWithError, action);
    
    expect(result.loading).toBe('pending');
    expect(result.error).toBeNull();
  });

  it('should update order number on fulfilled', () => {
    const stateWithNumber = { ...initialState, number: 11111, loading: 'pending' as const };
    const newOrderNumber = 22222;
    const action = {
      type: createOrder.fulfilled.type,
      payload: newOrderNumber,
    };
    const result = orderReducer(stateWithNumber, action);
    
    expect(result.number).toBe(newOrderNumber);
  });
});

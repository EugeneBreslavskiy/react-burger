import { orderReducer, createOrder } from './orderSlice';

describe('orderReducer', () => {
  it('should return initial state', () => {
    expect(orderReducer(undefined, { type: 'unknown' })).toEqual({
      number: null,
      loading: 'idle',
      error: null,
    });
  });

  it('should handle createOrder.pending', () => {
    const initialState = {
      number: null,
      loading: 'idle' as const,
      error: null,
    };
    const action = { type: createOrder.pending.type };
    const result = orderReducer(initialState, action);
    
    expect(result.loading).toBe('pending');
    expect(result.error).toBeNull();
    expect(result.number).toBeNull();
  });

  it('should handle createOrder.fulfilled', () => {
    const initialState = {
      number: null,
      loading: 'pending' as const,
      error: null,
    };
    const orderNumber = 12345;
    const action = {
      type: createOrder.fulfilled.type,
      payload: orderNumber,
    };
    const result = orderReducer(initialState, action);
    
    expect(result.loading).toBe('succeeded');
    expect(result.number).toBe(orderNumber);
    expect(result.error).toBeNull();
  });

  it('should handle createOrder.rejected', () => {
    const initialState = {
      number: null,
      loading: 'pending' as const,
      error: null,
    };
    const action = {
      type: createOrder.rejected.type,
      payload: 'Ошибка создания заказа',
    };
    const result = orderReducer(initialState, action);
    
    expect(result.loading).toBe('failed');
    expect(result.error).toBe('Ошибка создания заказа');
    expect(result.number).toBeNull();
  });

  it('should handle createOrder.rejected with error message', () => {
    const initialState = {
      number: null,
      loading: 'pending' as const,
      error: null,
    };
    const action = {
      type: createOrder.rejected.type,
      error: { message: 'Network error' },
    };
    const result = orderReducer(initialState, action);
    
    expect(result.loading).toBe('failed');
    expect(result.error).toBe('Network error');
  });

  it('should clear error on pending', () => {
    const initialState = {
      number: 12345,
      loading: 'failed' as const,
      error: 'Previous error',
    };
    const action = { type: createOrder.pending.type };
    const result = orderReducer(initialState, action);
    
    expect(result.loading).toBe('pending');
    expect(result.error).toBeNull();
  });

  it('should update order number on fulfilled', () => {
    const initialState = {
      number: 11111,
      loading: 'pending' as const,
      error: null,
    };
    const newOrderNumber = 22222;
    const action = {
      type: createOrder.fulfilled.type,
      payload: newOrderNumber,
    };
    const result = orderReducer(initialState, action);
    
    expect(result.number).toBe(newOrderNumber);
  });
});

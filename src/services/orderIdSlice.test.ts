import { orderIdReducer, setOrderId, clearOrderId } from './orderIdSlice';

describe('orderIdReducer', () => {
  it('should return initial state', () => {
    expect(orderIdReducer(undefined, { type: 'unknown' })).toEqual({
      orderId: undefined,
    });
  });

  it('should handle setOrderId', () => {
    const initialState = { orderId: undefined };
    const action = setOrderId('12345');
    const result = orderIdReducer(initialState, action);
    
    expect(result).toEqual({
      orderId: '12345',
    });
  });

  it('should handle setOrderId with undefined', () => {
    const initialState = { orderId: '12345' };
    const action = setOrderId(undefined);
    const result = orderIdReducer(initialState, action);
    
    expect(result).toEqual({
      orderId: undefined,
    });
  });

  it('should handle clearOrderId', () => {
    const initialState = { orderId: '12345' };
    const action = clearOrderId();
    const result = orderIdReducer(initialState, action);
    
    expect(result).toEqual({
      orderId: undefined,
    });
  });

  it('should update orderId when setting new value', () => {
    const initialState = { orderId: '12345' };
    const action = setOrderId('67890');
    const result = orderIdReducer(initialState, action);
    
    expect(result).toEqual({
      orderId: '67890',
    });
  });
});

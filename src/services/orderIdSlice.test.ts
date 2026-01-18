import { orderIdReducer, setOrderId, clearOrderId, initialState } from './orderIdSlice';

describe('orderIdReducer', () => {
  it('should return initial state', () => {
    expect(orderIdReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setOrderId', () => {
    const action = setOrderId('12345');
    const result = orderIdReducer(initialState, action);
    
    expect(result).toEqual({
      orderId: '12345',
    });
  });

  it('should handle setOrderId with undefined', () => {
    const stateWithId = { orderId: '12345' };
    const action = setOrderId(undefined);
    const result = orderIdReducer(stateWithId, action);
    
    expect(result).toEqual(initialState);
  });

  it('should handle clearOrderId', () => {
    const stateWithId = { orderId: '12345' };
    const action = clearOrderId();
    const result = orderIdReducer(stateWithId, action);
    
    expect(result).toEqual(initialState);
  });

  it('should update orderId when setting new value', () => {
    const stateWithId = { orderId: '12345' };
    const action = setOrderId('67890');
    const result = orderIdReducer(stateWithId, action);
    
    expect(result).toEqual({
      orderId: '67890',
    });
  });
});

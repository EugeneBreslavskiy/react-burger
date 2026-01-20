import {
  ordersWebSocketReducer,
  setConnected,
  setDisconnected,
  setOrders,
  setLoading,
  clearOrders,
  clearCurrentOrder,
  setUserConnected,
  setUserDisconnected,
  setUserOrders,
  clearUserOrders,
  fetchOrderByNumber,
  initialState,
} from './ordersWebSocketSlice';
import type { Order } from './ordersWebSocketSlice';

const mockOrder: Order = {
  _id: 'order-1',
  ingredients: ['ingredient-1', 'ingredient-2'],
  status: 'done',
  name: 'Test Order',
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  number: 12345,
};

const mockOrders: Order[] = [mockOrder];

describe('ordersWebSocketReducer', () => {
  it('should return initial state', () => {
    expect(ordersWebSocketReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setConnected', () => {
    const action = setConnected();
    const result = ordersWebSocketReducer(initialState, action);
    
    expect(result.connected).toBe(true);
  });

  it('should handle setDisconnected', () => {
    const stateConnected = { ...initialState, connected: true };
    const action = setDisconnected();
    const result = ordersWebSocketReducer(stateConnected, action);
    
    expect(result.connected).toBe(false);
  });

  it('should handle setOrders', () => {
    const stateWithLoading = { ...initialState, connected: true, loading: true };
    const action = setOrders({
      orders: mockOrders,
      total: 100,
      totalToday: 10,
    });
    const result = ordersWebSocketReducer(stateWithLoading, action);
    
    expect(result.orders).toEqual(mockOrders);
    expect(result.total).toBe(100);
    expect(result.totalToday).toBe(10);
    expect(result.loading).toBe(false);
  });

  it('should handle setLoading', () => {
    const action = setLoading();
    const result = ordersWebSocketReducer(initialState, action);
    
    expect(result.loading).toBe(true);
  });

  it('should handle clearOrders', () => {
    const stateWithOrders = {
      ...initialState,
      orders: mockOrders,
      total: 100,
      totalToday: 10,
      connected: true,
    };
    const action = clearOrders();
    const result = ordersWebSocketReducer(stateWithOrders, action);
    
    expect(result.orders).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.totalToday).toBe(0);
  });

  it('should handle clearCurrentOrder', () => {
    const stateWithOrder = { ...initialState, currentOrder: mockOrder };
    const action = clearCurrentOrder();
    const result = ordersWebSocketReducer(stateWithOrder, action);
    
    expect(result.currentOrder).toBeNull();
  });

  it('should handle setUserConnected', () => {
    const action = setUserConnected();
    const result = ordersWebSocketReducer(initialState, action);
    
    expect(result.userConnected).toBe(true);
  });

  it('should handle setUserDisconnected', () => {
    const stateUserConnected = { ...initialState, userConnected: true };
    const action = setUserDisconnected();
    const result = ordersWebSocketReducer(stateUserConnected, action);
    
    expect(result.userConnected).toBe(false);
  });

  it('should handle setUserOrders', () => {
    const stateUserConnected = { ...initialState, userConnected: true };
    const action = setUserOrders({
      orders: mockOrders,
      total: 50,
      totalToday: 5,
    });
    const result = ordersWebSocketReducer(stateUserConnected, action);
    
    expect(result.userOrders).toEqual(mockOrders);
    expect(result.userTotal).toBe(50);
    expect(result.userTotalToday).toBe(5);
  });

  it('should handle clearUserOrders', () => {
    const stateWithUserOrders = {
      ...initialState,
      userOrders: mockOrders,
      userTotal: 50,
      userTotalToday: 5,
      userConnected: true,
    };
    const action = clearUserOrders();
    const result = ordersWebSocketReducer(stateWithUserOrders, action);
    
    expect(result.userOrders).toEqual([]);
    expect(result.userTotal).toBe(0);
    expect(result.userTotalToday).toBe(0);
  });

  it('should handle fetchOrderByNumber.pending', () => {
    const action = { type: fetchOrderByNumber.pending.type };
    const result = ordersWebSocketReducer(initialState, action);
    
    expect(result.loading).toBe(true);
  });

  it('should handle fetchOrderByNumber.fulfilled', () => {
    const stateLoading = { ...initialState, loading: true };
    const action = {
      type: fetchOrderByNumber.fulfilled.type,
      payload: mockOrder,
    };
    const result = ordersWebSocketReducer(stateLoading, action);
    
    expect(result.loading).toBe(false);
    expect(result.currentOrder).toEqual(mockOrder);
  });

  it('should handle fetchOrderByNumber.rejected', () => {
    const stateWithOrder = { ...initialState, loading: true, currentOrder: mockOrder };
    const action = { type: fetchOrderByNumber.rejected.type };
    const result = ordersWebSocketReducer(stateWithOrder, action);
    
    expect(result.loading).toBe(false);
    expect(result.currentOrder).toBeNull();
  });
});

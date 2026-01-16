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
    expect(ordersWebSocketReducer(undefined, { type: 'unknown' })).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      connected: false,
      userOrders: [],
      userTotal: 0,
      userTotalToday: 0,
      userConnected: false,
      loading: false,
      currentOrder: null,
    });
  });

  it('should handle setConnected', () => {
    const initialState = {
      orders: [],
      total: 0,
      totalToday: 0,
      connected: false,
      userOrders: [],
      userTotal: 0,
      userTotalToday: 0,
      userConnected: false,
      loading: false,
      currentOrder: null,
    };
    const action = setConnected();
    const result = ordersWebSocketReducer(initialState, action);
    
    expect(result.connected).toBe(true);
  });

  it('should handle setDisconnected', () => {
    const initialState = {
      orders: [],
      total: 0,
      totalToday: 0,
      connected: true,
      userOrders: [],
      userTotal: 0,
      userTotalToday: 0,
      userConnected: false,
      loading: false,
      currentOrder: null,
    };
    const action = setDisconnected();
    const result = ordersWebSocketReducer(initialState, action);
    
    expect(result.connected).toBe(false);
  });

  it('should handle setOrders', () => {
    const initialState = {
      orders: [],
      total: 0,
      totalToday: 0,
      connected: true,
      userOrders: [],
      userTotal: 0,
      userTotalToday: 0,
      userConnected: false,
      loading: true,
      currentOrder: null,
    };
    const action = setOrders({
      orders: mockOrders,
      total: 100,
      totalToday: 10,
    });
    const result = ordersWebSocketReducer(initialState, action);
    
    expect(result.orders).toEqual(mockOrders);
    expect(result.total).toBe(100);
    expect(result.totalToday).toBe(10);
    expect(result.loading).toBe(false);
  });

  it('should handle setLoading', () => {
    const initialState = {
      orders: [],
      total: 0,
      totalToday: 0,
      connected: false,
      userOrders: [],
      userTotal: 0,
      userTotalToday: 0,
      userConnected: false,
      loading: false,
      currentOrder: null,
    };
    const action = setLoading();
    const result = ordersWebSocketReducer(initialState, action);
    
    expect(result.loading).toBe(true);
  });

  it('should handle clearOrders', () => {
    const initialState = {
      orders: mockOrders,
      total: 100,
      totalToday: 10,
      connected: true,
      userOrders: [],
      userTotal: 0,
      userTotalToday: 0,
      userConnected: false,
      loading: false,
      currentOrder: null,
    };
    const action = clearOrders();
    const result = ordersWebSocketReducer(initialState, action);
    
    expect(result.orders).toEqual([]);
    expect(result.total).toBe(0);
    expect(result.totalToday).toBe(0);
  });

  it('should handle clearCurrentOrder', () => {
    const initialState = {
      orders: [],
      total: 0,
      totalToday: 0,
      connected: false,
      userOrders: [],
      userTotal: 0,
      userTotalToday: 0,
      userConnected: false,
      loading: false,
      currentOrder: mockOrder,
    };
    const action = clearCurrentOrder();
    const result = ordersWebSocketReducer(initialState, action);
    
    expect(result.currentOrder).toBeNull();
  });

  it('should handle setUserConnected', () => {
    const initialState = {
      orders: [],
      total: 0,
      totalToday: 0,
      connected: false,
      userOrders: [],
      userTotal: 0,
      userTotalToday: 0,
      userConnected: false,
      loading: false,
      currentOrder: null,
    };
    const action = setUserConnected();
    const result = ordersWebSocketReducer(initialState, action);
    
    expect(result.userConnected).toBe(true);
  });

  it('should handle setUserDisconnected', () => {
    const initialState = {
      orders: [],
      total: 0,
      totalToday: 0,
      connected: false,
      userOrders: [],
      userTotal: 0,
      userTotalToday: 0,
      userConnected: true,
      loading: false,
      currentOrder: null,
    };
    const action = setUserDisconnected();
    const result = ordersWebSocketReducer(initialState, action);
    
    expect(result.userConnected).toBe(false);
  });

  it('should handle setUserOrders', () => {
    const initialState = {
      orders: [],
      total: 0,
      totalToday: 0,
      connected: false,
      userOrders: [],
      userTotal: 0,
      userTotalToday: 0,
      userConnected: true,
      loading: false,
      currentOrder: null,
    };
    const action = setUserOrders({
      orders: mockOrders,
      total: 50,
      totalToday: 5,
    });
    const result = ordersWebSocketReducer(initialState, action);
    
    expect(result.userOrders).toEqual(mockOrders);
    expect(result.userTotal).toBe(50);
    expect(result.userTotalToday).toBe(5);
  });

  it('should handle clearUserOrders', () => {
    const initialState = {
      orders: [],
      total: 0,
      totalToday: 0,
      connected: false,
      userOrders: mockOrders,
      userTotal: 50,
      userTotalToday: 5,
      userConnected: true,
      loading: false,
      currentOrder: null,
    };
    const action = clearUserOrders();
    const result = ordersWebSocketReducer(initialState, action);
    
    expect(result.userOrders).toEqual([]);
    expect(result.userTotal).toBe(0);
    expect(result.userTotalToday).toBe(0);
  });

  it('should handle fetchOrderByNumber.pending', () => {
    const initialState = {
      orders: [],
      total: 0,
      totalToday: 0,
      connected: false,
      userOrders: [],
      userTotal: 0,
      userTotalToday: 0,
      userConnected: false,
      loading: false,
      currentOrder: null,
    };
    const action = { type: fetchOrderByNumber.pending.type };
    const result = ordersWebSocketReducer(initialState, action);
    
    expect(result.loading).toBe(true);
  });

  it('should handle fetchOrderByNumber.fulfilled', () => {
    const initialState = {
      orders: [],
      total: 0,
      totalToday: 0,
      connected: false,
      userOrders: [],
      userTotal: 0,
      userTotalToday: 0,
      userConnected: false,
      loading: true,
      currentOrder: null,
    };
    const action = {
      type: fetchOrderByNumber.fulfilled.type,
      payload: mockOrder,
    };
    const result = ordersWebSocketReducer(initialState, action);
    
    expect(result.loading).toBe(false);
    expect(result.currentOrder).toEqual(mockOrder);
  });

  it('should handle fetchOrderByNumber.rejected', () => {
    const initialState = {
      orders: [],
      total: 0,
      totalToday: 0,
      connected: false,
      userOrders: [],
      userTotal: 0,
      userTotalToday: 0,
      userConnected: false,
      loading: true,
      currentOrder: mockOrder,
    };
    const action = { type: fetchOrderByNumber.rejected.type };
    const result = ordersWebSocketReducer(initialState, action);
    
    expect(result.loading).toBe(false);
    expect(result.currentOrder).toBeNull();
  });
});

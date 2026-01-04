import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { HttpClient } from '../utils/httpClient';
import { API_URL } from '../utils/api';

export interface Order {
  _id: string;
  ingredients: string[];
  status: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
  [key: string]: unknown;
}

interface OrdersWebSocketState {
  orders: Order[];
  total: number;
  totalToday: number;
  connected: boolean;
  userOrders: Order[];
  userTotal: number;
  userTotalToday: number;
  userConnected: boolean;
  loading: boolean;
  currentOrder: Order | null;
}

const initialState: OrdersWebSocketState = {
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

const httpClient = new HttpClient({ baseUrl: API_URL });

export const fetchOrderByNumber = createAsyncThunk<Order, number>(
  'ordersWebSocket/fetchOrderByNumber',
  async (orderNumber, { rejectWithValue }) => {
    try {
      const res = await httpClient.get<{ success: boolean; orders: Order[] }>(`orders/${orderNumber}`);
      if (res.success && res.orders && res.orders.length > 0) {
        return res.orders[0];
      }
      throw new Error('Order not found');
    } catch (error) {
      return rejectWithValue((error as Error).message || 'Failed to fetch order details');
    }
  }
);

const ordersWebSocketSlice = createSlice({
  name: 'ordersWebSocket',
  initialState,
  reducers: {
    setConnected(state) {
      state.connected = true;
    },
    setDisconnected(state) {
      state.connected = false;
    },
    setOrders(state, action: PayloadAction<{ orders: Order[]; total: number; totalToday: number }>) {
      state.orders = action.payload.orders;
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
      state.loading = false;
    },
    setLoading(state) {
      state.loading = true;
    },
    clearOrders(state) {
      state.orders = [];
      state.total = 0;
      state.totalToday = 0;
    },
    clearCurrentOrder(state) {
      state.currentOrder = null;
    },
    setUserConnected(state) {
      state.userConnected = true;
    },
    setUserDisconnected(state) {
      state.userConnected = false;
    },
    setUserOrders(state, action: PayloadAction<{ orders: Order[]; total: number; totalToday: number }>) {
      state.userOrders = action.payload.orders;
      state.userTotal = action.payload.total;
      state.userTotalToday = action.payload.totalToday;
    },
    clearUserOrders(state) {
      state.userOrders = [];
      state.userTotal = 0;
      state.userTotalToday = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state) => {
        state.loading = false;
        state.currentOrder = null;
      });
  },
});

export const connectWebSocket = () => ({ type: 'ws/connect' as const });
export const disconnectWebSocket = () => ({ type: 'ws/disconnect' as const });
export const sendWebSocketMessage = (payload: any) => ({
  type: 'ws/send' as const,
  payload
});

export const connectFeedWebSocket = () => ({ type: 'ws/feed/connect' as const });
export const disconnectFeedWebSocket = () => ({ type: 'ws/feed/disconnect' as const });
export const sendFeedWebSocketMessage = (payload: any) => ({
  type: 'ws/feed/send' as const,
  payload
});

export const connectUserWebSocket = () => ({ type: 'ws/user/connect' as const });
export const disconnectUserWebSocket = () => ({ type: 'ws/user/disconnect' as const });
export const sendUserWebSocketMessage = (payload: any) => ({
  type: 'ws/user/send' as const,
  payload
});

export const {
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
} = ordersWebSocketSlice.actions;

export const { reducer: ordersWebSocketReducer } = ordersWebSocketSlice;
export type { OrdersWebSocketState };


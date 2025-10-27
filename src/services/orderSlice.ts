import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { HttpClient } from '../utils/httpClient';
import { API_URL } from '../utils/api';

interface OrderState {
  number: number | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: OrderState = {
  number: null,
  loading: 'idle',
  error: null,
};

const httpClient = new HttpClient({ baseUrl: API_URL });

export const createOrder = createAsyncThunk<number, string[]>(
  'order/createOrder',
  async (ingredientIds, { rejectWithValue }) => {
    try {
      const res = await httpClient.post<{ order?: { number: number } }>('orders', { ingredients: ingredientIds });
      return (res.order && res.order.number) ? res.order.number : 0;
    } catch (err) {
      return rejectWithValue((err as Error).message || 'Failed to create order');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
  },
  extraReducers: builder => {
    builder
      .addCase(createOrder.pending, state => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = 'succeeded';
        state.number = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = (action.payload as string) || action.error.message || 'Failed to create order';
      });
  },
});

export const { reducer } = orderSlice;
export { reducer as orderReducer };

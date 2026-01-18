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

type OrderResponse = {
  success?: boolean;
  order?: {
    number: number;
  };
  name?: string;
};

export const createOrder = createAsyncThunk<number, string[]>(
  'order/createOrder',
  async (ingredientIds, { rejectWithValue }) => {
    try {
      if (!ingredientIds || ingredientIds.length === 0) {
        throw new Error('Необходимо выбрать ингредиенты');
      }

      const res = await httpClient.post<OrderResponse>('orders', { ingredients: ingredientIds });

      // Проверяем различные варианты структуры ответа
      if (res.order?.number) {
        return res.order.number;
      }

      // Если структура ответа неожиданная, выбрасываем ошибку
      throw new Error('Неверный формат ответа от сервера: отсутствует номер заказа');
    } catch (err) {
      let errorMessage = 'Не удалось оформить заказ';

      if (err instanceof Error) {
        errorMessage = err.message;
        // Если это ошибка таймаута, даем более понятное сообщение
        if (err.message.includes('время ожидания') || err.message.includes('timeout')) {
          errorMessage = 'Превышено время ожидания. Попробуйте еще раз';
        }
      }

      return rejectWithValue(errorMessage);
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
        state.error = (action.payload as string) || action.error.message || 'Не удалось оформить заказ';
      });
  },
});

export const { reducer } = orderSlice;
export { reducer as orderReducer };
export { initialState };
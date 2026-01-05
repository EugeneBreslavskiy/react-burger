import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HttpClient } from '../utils/httpClient';
import { API_URL } from '../utils/api';
import { IngredientSchema } from '../types/ingredients';

interface IngredientsStateSchema {
  items: IngredientSchema[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: IngredientsStateSchema = {
  items: [],
  loading: 'idle',
  error: null,
};

const httpClient = new HttpClient({ baseUrl: API_URL });

interface IngredientsResponse {
  data?: IngredientSchema[];
  ingredients?: IngredientSchema[];
}

export const fetchIngredients = createAsyncThunk<IngredientSchema[]>(
  'ingredients/fetchIngredients',
  async (_, { rejectWithValue }) => {
    try {
      const res = await httpClient.get<IngredientSchema[] | IngredientsResponse>('ingredients');

      if (Array.isArray(res)) return res as IngredientSchema[];

      if (res && Array.isArray(res.data)) return res.data as IngredientSchema[];

      if (res && Array.isArray(res.ingredients)) return res.ingredients as IngredientSchema[];

      return [] as IngredientSchema[];
    } catch (err) {
      return rejectWithValue((err as Error).message || 'Не удалось загрузить ингредиенты');
    }
  },
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchIngredients.pending, state => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action: PayloadAction<IngredientSchema[]>) => {
        state.loading = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = (action.payload as string) || action.error.message || 'Не удалось загрузить ингредиенты';
      });
  },
});

const { reducer } = ingredientsSlice;

export { reducer as ingredientsReducer };
export type { IngredientsStateSchema };

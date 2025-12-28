import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IngredientIdState {
  ingredientId: string | undefined;
}

const initialState: IngredientIdState = {
  ingredientId: undefined,
};

const ingredientIdSlice = createSlice({
  name: 'ingredientId',
  initialState,
  reducers: {
    setIngredientId(state, action: PayloadAction<string | undefined>) {
      state.ingredientId = action.payload;
    },
  },
});

export const { setIngredientId } = ingredientIdSlice.actions;
export const { reducer: ingredientIdReducer } = ingredientIdSlice;



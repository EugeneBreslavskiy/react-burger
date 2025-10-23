import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IngredientDetailsSchema } from '../types/ingredients';

interface IngredientDetailsState {
  item: IngredientDetailsSchema | null;
}

const initialState: IngredientDetailsState = {
  item: null,
};

const ingredientDetailsSlice = createSlice({
  name: 'ingredientDetails',
  initialState,
  reducers: {
    setIngredient(state, action: PayloadAction<IngredientDetailsSchema>) {
      state.item = action.payload;
    },
    clearIngredient(state) {
      state.item = null;
    },
  },
});

export const { setIngredient, clearIngredient } = ingredientDetailsSlice.actions;
export const { reducer } = ingredientDetailsSlice;
export { reducer as ingredientDetailsReducer };


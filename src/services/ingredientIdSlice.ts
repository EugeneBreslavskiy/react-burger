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
    clearIngredientId(state) {
      state.ingredientId = undefined;
    },
  },
});

export const { setIngredientId, clearIngredientId } = ingredientIdSlice.actions;
export const { reducer } = ingredientIdSlice;
export { reducer as ingredientIdReducer };


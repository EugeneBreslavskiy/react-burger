import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IngredientSchema } from '../types/ingredients';

export interface ConstructorItem extends IngredientSchema {
  uuid?: string;
}

interface ConstructorStateSchema {
  items: ConstructorItem[];
  bun: IngredientSchema | null;
}

const initialState: ConstructorStateSchema = {
  items: [],
  bun: null,
};

const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient(state, action: PayloadAction<ConstructorItem>) {
      const item = { ...action.payload };

      if (item.type === 'bun') {
        state.bun = item;
      } else {
        state.items.push(item);
      }
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.uuid !== action.payload);
    },
    moveIngredient(state, action: PayloadAction<{ fromIndex: number; toIndex: number }>) {
      const { fromIndex, toIndex } = action.payload;
      const item = state.items.splice(fromIndex, 1)[0];
      state.items.splice(toIndex, 0, item);
    },
    clearConstructor(state) {
      state.items = [];
      state.bun = null;
    },
  },
});

export const { addIngredient, removeIngredient, moveIngredient, clearConstructor } = constructorSlice.actions;
const { reducer } = constructorSlice;

export { reducer as constructorReducer };

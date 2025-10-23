import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IngredientSchema } from '../types/ingredients';

export interface ConstructorItem extends IngredientSchema {
  uuid?: string; // уникальный идентификатор внутри конструктора
}

interface ConstructorStateSchema {
  items: ConstructorItem[]; // non-bun ingredients in order
  bun: IngredientSchema | null; // selected bun
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
      const item = { ...action.payload, uuid: action.payload.uuid || String(Date.now() + Math.random()) };
      if (item.type === 'bun') {
        // replace bun
        state.bun = item;
      } else {
        state.items.push(item);
      }
    },
    removeIngredient(state, action: PayloadAction<string>) {
      // action.payload = uuid
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

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderIdState {
  orderId: string | undefined;
}

const initialState: OrderIdState = {
  orderId: undefined,
};

const orderIdSlice = createSlice({
  name: 'orderId',
  initialState,
  reducers: {
    setOrderId(state, action: PayloadAction<string | undefined>) {
      state.orderId = action.payload;
    },
    clearOrderId(state) {
      state.orderId = undefined;
    },
  },
});

export const { setOrderId, clearOrderId } = orderIdSlice.actions;
export const { reducer: orderIdReducer } = orderIdSlice;
export { initialState };



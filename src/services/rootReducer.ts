import { combineReducers } from 'redux';
import { ingredientsReducer } from './ingredientsSlice';
import { orderReducer } from './orderSlice';
import { authReducer } from './authSlice';
import { constructorReducer } from './constructorSlice';
import { orderIdReducer } from './orderIdSlice';
import { ingredientIdReducer } from './ingredientIdSlice';
import { ordersWebSocketReducer } from './ordersWebSocketSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  order: orderReducer,
  burgerConstructor: constructorReducer,
  orderId: orderIdReducer,
  ingredientId: ingredientIdReducer,
  auth: authReducer,
  ordersWebSocket: ordersWebSocketReducer,
});

export default rootReducer;

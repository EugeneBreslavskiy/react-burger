import { combineReducers } from 'redux';
import { ingredientsReducer } from './ingredientsSlice';
import { ingredientsReducer as ingredientReducer } from './ingredientSlice';
import { constructorReducer } from './constructorSlice';
import { ingredientDetailsReducer } from './ingredientDetailsSlice';
import { orderReducer } from './orderSlice';
import { ingredientIdReducer } from './ingredientIdSlice';
import { orderIdReducer } from './orderIdSlice';
import { authReducer } from './authSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  ingredient: ingredientReducer,
  burgerConstructor: constructorReducer,
  ingredientDetails: ingredientDetailsReducer,
  order: orderReducer,
  ingredientId: ingredientIdReducer,
  orderId: orderIdReducer,
  auth: authReducer,
});

export default rootReducer;

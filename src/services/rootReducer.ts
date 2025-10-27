import { combineReducers } from 'redux';
import { ingredientsReducer } from './ingredientsSlice';
import { ingredientsReducer as ingredientReducer } from './ingredientSlice';
import { constructorReducer } from './constructorSlice';
import { ingredientDetailsReducer } from './ingredientDetailsSlice';
import { orderReducer } from './orderSlice';
import { ingredientIdReducer } from './ingredientIdSlice';
import { orderIdReducer } from './orderIdSlice';

const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  ingredient: ingredientReducer,
  burgerConstructor: constructorReducer,
  ingredientDetails: ingredientDetailsReducer,
  order: orderReducer,
  ingredientId: ingredientIdReducer,
  orderId: orderIdReducer,
});

export default rootReducer;

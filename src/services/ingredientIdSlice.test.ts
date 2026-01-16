import { ingredientIdReducer, setIngredientId } from './ingredientIdSlice';

describe('ingredientIdReducer', () => {
  it('should return initial state', () => {
    expect(ingredientIdReducer(undefined, { type: 'unknown' })).toEqual({
      ingredientId: undefined,
    });
  });

  it('should handle setIngredientId', () => {
    const initialState = { ingredientId: undefined };
    const action = setIngredientId('123');
    const result = ingredientIdReducer(initialState, action);
    
    expect(result).toEqual({
      ingredientId: '123',
    });
  });

  it('should handle setIngredientId with undefined', () => {
    const initialState = { ingredientId: '123' };
    const action = setIngredientId(undefined);
    const result = ingredientIdReducer(initialState, action);
    
    expect(result).toEqual({
      ingredientId: undefined,
    });
  });

  it('should update ingredientId when setting new value', () => {
    const initialState = { ingredientId: '123' };
    const action = setIngredientId('456');
    const result = ingredientIdReducer(initialState, action);
    
    expect(result).toEqual({
      ingredientId: '456',
    });
  });
});

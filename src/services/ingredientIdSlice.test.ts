import { ingredientIdReducer, setIngredientId, initialState } from './ingredientIdSlice';

describe('ingredientIdReducer', () => {
  it('should return initial state', () => {
    expect(ingredientIdReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setIngredientId', () => {
    const action = setIngredientId('123');
    const result = ingredientIdReducer(initialState, action);
    
    expect(result).toEqual({
      ingredientId: '123',
    });
  });

  it('should handle setIngredientId with undefined', () => {
    const stateWithId = { ingredientId: '123' };
    const action = setIngredientId(undefined);
    const result = ingredientIdReducer(stateWithId, action);
    
    expect(result).toEqual(initialState);
  });

  it('should update ingredientId when setting new value', () => {
    const stateWithId = { ingredientId: '123' };
    const action = setIngredientId('456');
    const result = ingredientIdReducer(stateWithId, action);
    
    expect(result).toEqual({
      ingredientId: '456',
    });
  });
});

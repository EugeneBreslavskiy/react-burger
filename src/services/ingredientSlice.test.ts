import { ingredientsReducer, initialState } from './ingredientSlice';

describe('ingredientsReducer (ingredientSlice)', () => {
  it('should return initial state', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should return same state for unknown action', () => {
    const action = { type: 'unknown' };
    const result = ingredientsReducer(initialState, action);
    
    expect(result).toBe(initialState);
    expect(result).toEqual(initialState);
  });
});

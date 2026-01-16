import { ingredientsReducer } from './ingredientSlice';

describe('ingredientsReducer (ingredientSlice)', () => {
  it('should return initial state', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual({});
  });

  it('should return same state for unknown action', () => {
    const state = {};
    const action = { type: 'unknown' };
    const result = ingredientsReducer(state, action);
    
    expect(result).toBe(state);
    expect(result).toEqual({});
  });
});

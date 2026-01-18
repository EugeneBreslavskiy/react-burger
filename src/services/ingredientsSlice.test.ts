import { ingredientsReducer, fetchIngredients, initialState } from './ingredientsSlice';
import type { IngredientSchema } from '../types/ingredients';

const mockIngredients: IngredientSchema[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'image.png',
    image_mobile: 'image-mobile.png',
    image_large: 'image-large.png',
    __v: 0,
  },
  {
    _id: '2',
    name: 'Котлета',
    type: 'main',
    proteins: 20,
    fat: 10,
    carbohydrates: 5,
    calories: 100,
    price: 200,
    image: 'image.png',
    image_mobile: 'image-mobile.png',
    image_large: 'image-large.png',
    __v: 0,
  },
];

describe('ingredientsReducer', () => {
  it('should return initial state', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const result = ingredientsReducer(initialState, action);
    
    expect(result.loading).toBe('pending');
    expect(result.error).toBeNull();
    expect(result.items).toEqual([]);
  });

  it('should handle fetchIngredients.fulfilled', () => {
    const statePending = { ...initialState, loading: 'pending' as const };
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients,
    };
    const result = ingredientsReducer(statePending, action);
    
    expect(result.loading).toBe('succeeded');
    expect(result.items).toEqual(mockIngredients);
    expect(result.error).toBeNull();
  });

  it('should handle fetchIngredients.rejected', () => {
    const statePending = { ...initialState, loading: 'pending' as const };
    const action = {
      type: fetchIngredients.rejected.type,
      payload: 'Ошибка загрузки',
    };
    const result = ingredientsReducer(statePending, action);
    
    expect(result.loading).toBe('failed');
    expect(result.error).toBe('Ошибка загрузки');
    expect(result.items).toEqual([]);
  });

  it('should handle fetchIngredients.rejected with error message', () => {
    const statePending = { ...initialState, loading: 'pending' as const };
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Network error' },
    };
    const result = ingredientsReducer(statePending, action);
    
    expect(result.loading).toBe('failed');
    expect(result.error).toBe('Network error');
  });

  it('should clear error on pending', () => {
    const stateWithError = {
      ...initialState,
      items: mockIngredients,
      loading: 'failed' as const,
      error: 'Previous error',
    };
    const action = { type: fetchIngredients.pending.type };
    const result = ingredientsReducer(stateWithError, action);
    
    expect(result.loading).toBe('pending');
    expect(result.error).toBeNull();
  });
});

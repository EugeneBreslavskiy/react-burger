import { constructorReducer, addIngredient, removeIngredient, moveIngredient, clearConstructor, initialState } from './constructorSlice';
import type { ConstructorItem } from './constructorSlice';
import type { IngredientSchema } from '../types/ingredients';

const mockBun: IngredientSchema = {
  _id: 'bun-1',
  name: 'Краторная булка',
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
};

const mockMain: IngredientSchema = {
  _id: 'main-1',
  name: 'Биокотлета',
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
};

const mockSauce: IngredientSchema = {
  _id: 'sauce-1',
  name: 'Соус',
  type: 'sauce',
  proteins: 5,
  fat: 2,
  carbohydrates: 3,
  calories: 50,
  price: 50,
  image: 'image.png',
  image_mobile: 'image-mobile.png',
  image_large: 'image-large.png',
  __v: 0,
};

describe('constructorReducer', () => {
  it('should return initial state', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle addIngredient for bun', () => {
    const ingredient: ConstructorItem = { ...mockBun };
    const action = addIngredient(ingredient);
    const result = constructorReducer(initialState, action);
    
    expect(result.bun).toEqual(ingredient);
    expect(result.items).toEqual([]);
  });

  it('should handle addIngredient for main ingredient', () => {
    const ingredient: ConstructorItem = { ...mockMain, uuid: 'uuid-1' };
    const action = addIngredient(ingredient);
    const result = constructorReducer(initialState, action);
    
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toEqual(ingredient);
    expect(result.bun).toBeNull();
  });

  it('should handle addIngredient for sauce', () => {
    const ingredient: ConstructorItem = { ...mockSauce, uuid: 'uuid-2' };
    const action = addIngredient(ingredient);
    const result = constructorReducer(initialState, action);
    
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toEqual(ingredient);
  });

  it('should replace bun when adding new bun', () => {
    const stateWithBun = { ...initialState, bun: mockBun };
    const newBun: ConstructorItem = { ...mockBun, _id: 'bun-2', name: 'Новая булка' };
    const action = addIngredient(newBun);
    const result = constructorReducer(stateWithBun, action);
    
    expect(result.bun).toEqual(newBun);
    expect(result.bun?._id).toBe('bun-2');
  });

  it('should handle removeIngredient', () => {
    const ingredient1: ConstructorItem = { ...mockMain, uuid: 'uuid-1' };
    const ingredient2: ConstructorItem = { ...mockSauce, uuid: 'uuid-2' };
    const stateWithItems = { ...initialState, items: [ingredient1, ingredient2] };
    const action = removeIngredient('uuid-1');
    const result = constructorReducer(stateWithItems, action);
    
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toEqual(ingredient2);
  });

  it('should not remove ingredient if uuid does not match', () => {
    const ingredient: ConstructorItem = { ...mockMain, uuid: 'uuid-1' };
    const stateWithItems = { ...initialState, items: [ingredient] };
    const action = removeIngredient('uuid-999');
    const result = constructorReducer(stateWithItems, action);
    
    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toEqual(ingredient);
  });

  it('should handle moveIngredient', () => {
    const ingredient1: ConstructorItem = { ...mockMain, uuid: 'uuid-1' };
    const ingredient2: ConstructorItem = { ...mockSauce, uuid: 'uuid-2' };
    const ingredient3: ConstructorItem = { ...mockMain, uuid: 'uuid-3' };
    const stateWithItems = { ...initialState, items: [ingredient1, ingredient2, ingredient3] };
    const action = moveIngredient({ fromIndex: 0, toIndex: 2 });
    const result = constructorReducer(stateWithItems, action);
    
    expect(result.items).toHaveLength(3);
    expect(result.items[0]).toEqual(ingredient2);
    expect(result.items[1]).toEqual(ingredient3);
    expect(result.items[2]).toEqual(ingredient1);
  });

  it('should handle clearConstructor', () => {
    const ingredient: ConstructorItem = { ...mockMain, uuid: 'uuid-1' };
    const stateWithItemsAndBun = { ...initialState, items: [ingredient], bun: mockBun };
    const action = clearConstructor();
    const result = constructorReducer(stateWithItemsAndBun, action);
    
    expect(result).toEqual(initialState);
  });
});

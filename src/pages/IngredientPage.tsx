import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../services/store';
import { IngredientDetails } from '../components/IngredientDetails/IngredientDetails';
import { setIngredientId } from '../services/ingredientIdSlice';
import type { IngredientNutrientSchema } from '../types/ingredients';

export const IngredientPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.ingredients.items);

  const ingredient = items.find((item: any) => item._id === id);

  React.useEffect(() => {
    if (id) {
      dispatch(setIngredientId(id));
    }

    return () => {
      dispatch(setIngredientId(undefined));
    };
  }, [dispatch, id]);

  const nutrients: IngredientNutrientSchema[] = React.useMemo(() => {
    if (!ingredient) return [];
    return [
      { name: 'Калории,ккал', value: ingredient.calories },
      { name: 'Белки, г', value: ingredient.proteins },
      { name: 'Жиры, г', value: ingredient.fat },
      { name: 'Углеводы, г', value: ingredient.carbohydrates },
    ];
  }, [ingredient]);

  if (!ingredient) {
    return null;
  }

  return (
    <IngredientDetails
      image_large={ingredient.image_large}
      name={ingredient.name}
      nutrients={nutrients}
    />
  );
};



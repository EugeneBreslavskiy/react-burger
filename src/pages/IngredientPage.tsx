import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { IngredientDetails } from '../components/IngredientDetails/IngredientDetails';
import { setIngredientId } from '../services/ingredientIdSlice';
import type { IngredientNutrientSchema } from '../types/ingredients';
import { PageSection } from '../components/PageSection/PageSection';
import { Container } from '../components/Container/Container';
import pageSectionStyles from '../components/PageSection/PageSection.module.css';

export const IngredientPage = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.ingredients.items);

  const ingredient = items.find((item) => item._id === id);

  useEffect(() => {
    if (id) {
      dispatch(setIngredientId(id));
    }

    return () => {
      dispatch(setIngredientId(undefined));
    };
  }, [dispatch, id]);

  const nutrients: IngredientNutrientSchema[] = useMemo(() => {
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
    <PageSection className={pageSectionStyles.pageSectionWithPadding}>
      <Container>
        <IngredientDetails
          image_large={ingredient.image_large}
          name={ingredient.name}
          nutrients={nutrients}
        />
      </Container>
    </PageSection>
  );
};



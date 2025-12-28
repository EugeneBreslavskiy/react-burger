import { useEffect, useMemo, FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../services/store';
import { IngredientDetails } from './IngredientDetails/IngredientDetails';
import { setIngredientId } from '../services/ingredientIdSlice';
import type { IngredientNutrientSchema } from '../types/ingredients';
import { useModal } from '../context/ModalContext/ModalContext';

export const IngredientDetailsOverlay: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.ingredients.items);
  const { setRenderModal } = useModal();

  const ingredient = items.find((it: any) => it._id === id);

  useEffect(() => {
    if (id) {
      dispatch(setIngredientId(id));
    }
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

  useEffect(() => {
    if (!ingredient) return;

    // Функция закрытия модального окна с навигацией назад по истории
    const handleClose = () => {
      navigate(-1);
    };

    setRenderModal({
      render: true,
      children: <IngredientDetails image_large={ingredient.image_large} name={ingredient.name} nutrients={nutrients} />,
      onClose: handleClose
    });

    return () => {
      // Cleanup при размонтировании компонента
      setRenderModal({ render: false, children: null, onClose: undefined });
    };
  }, [setRenderModal, ingredient, nutrients, navigate]);



  return null;
};

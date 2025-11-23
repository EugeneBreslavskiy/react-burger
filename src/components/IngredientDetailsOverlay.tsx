import { useEffect, useMemo, FC, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../services/store';
import { IngredientDetails } from './IngredientDetails/IngredientDetails';
import { setIngredientId } from '../services/ingredientIdSlice';
import type { IngredientNutrientSchema } from '../types/ingredients';
import { useModal } from '../context/ModalContext/ModalContext';

export const IngredientDetailsOverlay: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.ingredients.items);
  const { setRenderModal, renderModal } = useModal();
  const backgroundPathRef = useRef<string | null>(null);

  const ingredient = items.find((it: any) => it._id === id);

  useEffect(() => {
    const background = (location.state as any)?.background;
    backgroundPathRef.current = background?.pathname || '/';
  }, [location]);

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

    setRenderModal({
      render: true,
      children: <IngredientDetails image_large={ingredient.image_large} name={ingredient.name} nutrients={nutrients} />
    });

    return () => {
      setRenderModal({ render: false, children: null });
    };
  }, [setRenderModal, ingredient, nutrients]);



  return null;
};

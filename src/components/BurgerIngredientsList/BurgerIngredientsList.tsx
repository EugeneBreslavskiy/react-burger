import { FC, SyntheticEvent } from "react";
import { GroupedIngredients } from "../../types/ingredients";
import { BurgerIngredient } from "../BurgerIngredient/BurgerIngredient";
import { useDispatch } from 'react-redux';
import { setIngredientId } from "../../services/ingredientIdSlice";
import { useLocation, useNavigate } from 'react-router-dom';

import styles from './burger-ingredients-list.module.css';

interface IBurgerIngredientsList {
  ingredients: GroupedIngredients[]
}

const BurgerIngredientsList: FC<IBurgerIngredientsList> = ({ ingredients }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const onClickHandler = (e: SyntheticEvent<HTMLUListElement>) => {
    const target = e.target as HTMLElement | null;

    const id = target?.closest('[data-id]')?.getAttribute('data-id') as string | null;

    if (id) {
      dispatch(setIngredientId(id));
      try {
        sessionStorage.setItem('ingredientsBackground', 'true');
      } catch { }
      navigate(`/ingredients/${id}`, { state: { background: location } });
    }
  }

  return (
    <ul className={styles.burgerIngredientsList} onClick={onClickHandler}>
      {ingredients.map(({ title, items }) =>
        <li key={title} className={styles.burgerIngredientsListItem}>
          <h2 className={'text text_type_main-medium'}>
            {title}
          </h2>
          <ul className={styles.burgerIngredientsListItems}>
            {items.map((item) => <BurgerIngredient key={item._id} description={item} />)}
          </ul>
        </li>
      )}
    </ul>
  )
}

export { BurgerIngredientsList };

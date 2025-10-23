import {FC, SyntheticEvent} from "react";
import {GroupedIngredients} from "../../types/ingredients";
import {BurgerIngredient} from "../BurgerIngredient/BurgerIngredient";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../services/store';
import { setIngredientId } from '../../services/ingredientIdSlice';

import styles from './burger-ingredients-list.module.css';

interface IBurgerIngredientsList {
    ingredients: GroupedIngredients[]
}

const BurgerIngredientsList: FC<IBurgerIngredientsList> = ({ingredients}) => {
    const dispatch = useDispatch<AppDispatch>();

    const onClickHandler = (e: SyntheticEvent<HTMLUListElement>) => {
        const target = e.target as HTMLElement | null;

        const id = target?.closest('[data-id]')?.getAttribute('data-id') as string | null;

        if (id) {
            dispatch(setIngredientId(id));
        }
    }

    return (
        <ul className={styles.burgerIngredientsList} onClick={onClickHandler}>
            {ingredients.map(({title, items}) =>
                <li key={title} className={styles.burgerIngredientsListItem}>
                    <h2 className={'text text_type_main-medium'}>
                        {title}
                    </h2>
                    <ul className={styles.burgerIngredientsListItems}>
                        {items.map((item) => <BurgerIngredient key={item._id} description={item}/>)}
                    </ul>
                </li>
            )}
        </ul>
    )
}

export {BurgerIngredientsList };

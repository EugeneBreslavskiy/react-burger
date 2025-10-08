import {FC, SyntheticEvent} from "react";
import {GroupedIngredients} from "../../types/ingredients";
import {BurgerIngredient} from "../BurgerIngredient/BurgerIngredient";
import {useIngredientId} from "../../context/IngredientIdContext/IngredientIdContext";

import styles from './burger-ingredients-list.module.css';

interface IBurgerIngredientsList {
    ingredients: GroupedIngredients[]
}

const BurgerIngredientsList: FC<IBurgerIngredientsList> = ({ingredients}) => {
    const {setIngredientId} = useIngredientId();

    const onClickHandler = (e: SyntheticEvent<HTMLUListElement>) => {
        const target = e.target as HTMLElement | null;

        const id = target?.closest('[data-id]')?.getAttribute('data-id') as string | null;

        if (id) {
            setIngredientId(id);
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

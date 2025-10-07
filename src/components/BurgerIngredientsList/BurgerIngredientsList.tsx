import {FC} from "react";
import {GroupedIngredients} from "../../types/ingredients";
import {BurgerIngredient} from "../BurgerIngredient/BurgerIngredient";

import styles from './burger-ingredients-list.module.css';

interface IBurgerIngredientsList {
    ingredients: GroupedIngredients[]
}

const BurgerIngredientsList: FC<IBurgerIngredientsList> = ({ingredients}) => {
    return (
        <ul className={styles.burgerIngredientsList}>
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

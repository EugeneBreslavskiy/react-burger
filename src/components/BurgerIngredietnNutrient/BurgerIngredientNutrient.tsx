import React, {FC} from 'react';
import {IngredientNutrientSchema} from "../../types/ingredients";

import styles from './buger-ingredient-nutrient.module.css'

const BurgerIngredientNutrient: FC<IngredientNutrientSchema> = ({name, value}) => {
    return (
        <li className={styles.burgerIngredientNutrient}>
            <span className={`text text_type_main-default text_color_inactive ${styles.burgerIngredientNutrientProperty}`}>
                {name}
            </span>
            <span className={`text text_type_digits-default text_color_inactive ${styles.burgerIngredientNutrientProperty}`}>
                {value}
            </span>
        </li>
    );
};

export { BurgerIngredientNutrient };

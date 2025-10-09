import  {FC} from 'react';
import {Counter} from "@ya.praktikum/react-developer-burger-ui-components";
import {IngredientSchema} from "../../types/ingredients";

import styles from './burger-ingredient-item.module.css';
import {BurgerCredit} from "../BurgerCredit/BurgerCredit";

interface IBurgerIngredient {
    description: IngredientSchema;
}

const BurgerIngredient: FC<IBurgerIngredient> = ({description}) => {
    const {_id, name, image, price} = description;

    return (
        <li className={styles.burgerIngredient} data-id={_id}>
            <img src={image} alt={name}/>
            <BurgerCredit amount={price}/>
            <span className={`text text_type_main-default ${styles.burgerIngredientName}`}>
                {name}
            </span>
            <Counter count={1}/>
        </li>
    );
};

export { BurgerIngredient };

import React, {FC, useEffect} from 'react';
import {BurgerIngredientDetailsSchema} from "../../types/ingredients";
import {BurgerIngredientNutrient} from "../BurgerIngredietnNutrient/BurgerIngredientNutrient";
import {useIngredientId} from "../../context/IngredientIdContext/IngredientIdContext";

import styles from './burger-ingredient-details.module.css';

const BurgerIngredientDetails: FC<BurgerIngredientDetailsSchema> = ({image_large, name, nutrients}) => {
    const {setIngredientId} = useIngredientId();

    useEffect(() => {
        return () => {
            setIngredientId(undefined);
        }
    }, []);

    return (
        <section className={styles.burgerIngredientContainer}>
            <div className={styles.burgerIngredientTitleContainer}>
                <h4 className="text text_type_main-large">
                    Детали ингредиента
                </h4>
            </div>
            <div className={styles.burgerIngredient}>
                <img alt={name} src={image_large} className={styles.burgerIngredientImage} />
                <span className="text text_type_main-medium">
                    {name}
                </span>
                <ul className={styles.burgerIngredientNutrients}>
                    {nutrients.map(({name, value}) => <BurgerIngredientNutrient key={`${name}-${value}`} name={name} value={value} />)}
                </ul>
            </div>
        </section>
    );
};

export {BurgerIngredientDetails};

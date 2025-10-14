import React, {FC, useEffect} from 'react';
import {IngredientDetailsSchema} from "../../types/ingredients";
import {BurgerIngredientNutrient} from "../BurgerIngredietnNutrient/BurgerIngredientNutrient";
import {useIngredientId} from "../../context/IngredientIdContext/IngredientIdContext";

import styles from './ingredient-details.module.css';

const IngredientDetails: FC<IngredientDetailsSchema> = ({image_large, name, nutrients}) => {
    const {setIngredientId} = useIngredientId();

    useEffect(() => {
        return () => {
            setIngredientId(undefined);
        }
    }, []);

    return (
        <section className={styles.ingredientContainer}>
            <div className={styles.ingredientTitleContainer}>
                <h4 className="text text_type_main-large">
                    Детали ингредиента
                </h4>
            </div>
            <div className={styles.ingredient}>
                <img alt={name} src={image_large} className={styles.ingredientImage} />
                <span className="text text_type_main-medium">
                    {name}
                </span>
                <ul className={styles.ingredientNutrients}>
                    {nutrients.map(({name, value}) => <BurgerIngredientNutrient key={`${name}-${value}`} name={name} value={value} />)}
                </ul>
            </div>
        </section>
    );
};

export {IngredientDetails};

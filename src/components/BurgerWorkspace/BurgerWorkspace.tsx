import React, {FC, useCallback, useEffect} from "react";
import {
    BurgerOrderDetailsSchema,
    IngredientNutrientSchema,
    IngredientSchema,
    IngredientsSchema
} from "../../types/ingredients";
import {useIngredientId} from "../../context/IngredientIdContext/IngredientIdContext";
import {useOrderId} from "../../context/OrderContext/OrderContext";
import {useModal} from "../../context/ModalContext/ModalContext";
import {Title} from "../Title/Title";
import {Container} from "../Container/Container";
import {BurgerIngredients} from "../BurgerIngredients/BurgerIngredients";
import {BurgerConstructor} from "../BurgerConstructor/BurgerConstructor";
import {Modal} from "../Modal/Modal";
import {BurgerIngredientDetails} from "../BurgerIngredientDetails/BurgerIngredientDetails";
import {BurgerOrderDetails} from "../BurgerOrderDetails/BurgerOrderDetails";

import styles from "./burger-constructor.module.css";

const BurgerWorkspace: FC<IngredientsSchema> = ({ingredients}) => {
    const {setRenderModal} = useModal();
    const {ingredientId} = useIngredientId();
    const {orderId}  = useOrderId();

    useEffect(() => {
        if (ingredientId) {
            const ingredient = ingredients.find(({_id}) => _id === ingredientId);

            if (ingredient) {
                renderIngredientModal(ingredient)
            }
        }
    }, [ingredientId, ingredients]);

    useEffect(() => {

        if (orderId) {
            renderOrderModal({id: orderId});
        }
    }, [orderId]);

    const renderIngredientModal = useCallback((ingredient: IngredientSchema) => {
        const { image_large, name, calories, proteins, fat, carbohydrates } = ingredient;

        const nutrients: IngredientNutrientSchema[] = [
            {
                name: 'Калории,ккал',
                value: calories
            },
            {
                name: 'Белки, г',
                value: proteins
            },
            {
                name: 'Жиры, г',
                value: fat
            },
            {
                name: 'Углеводы, г',
                value: carbohydrates
            }
        ]

        setRenderModal({render: true, children: <BurgerIngredientDetails image_large={image_large} name={name} nutrients={nutrients} />})
    }, []);

    const renderOrderModal = useCallback(({id}: BurgerOrderDetailsSchema) => {
        setRenderModal({render: true, children: <BurgerOrderDetails id={id}/>})
    }, []);

    return (
        <section className={styles.burgerWorkspaceSection}>
            <Container>
                <Title>Соберите бургер</Title>
                <div className={styles.burgerWorkspace}>
                    <BurgerIngredients ingredients={ingredients}/>
                    <BurgerConstructor ingredients={ingredients}/>
                </div>
            </Container>
            <Modal/>
        </section>
    )
};

export { BurgerWorkspace };

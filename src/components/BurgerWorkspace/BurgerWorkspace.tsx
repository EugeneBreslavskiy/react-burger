import React, { FC, useCallback, useEffect } from "react";
import {
  OrderDetailsSchema,
  IngredientNutrientSchema,
  IngredientSchema,
  IngredientsSchema
} from "../../types/ingredients";
import { useSelector } from 'react-redux';
import type { RootState } from "../../services/store";
import { useModal } from "../../context/ModalContext/ModalContext";
import { Title } from "../Title/Title";
import { Container } from "../Container/Container";
import { BurgerIngredients } from "../BurgerIngredients/BurgerIngredients";
import { BurgerConstructor } from "../BurgerConstructor/BurgerConstructor";
import { Modal } from "../Modal/Modal";
import { IngredientDetails } from "../IngredientDetails/IngredientDetails";
import { OrderDetails } from "../OrderDetails/OrderDetails";

import styles from "./burger-constructor.module.css";

const BurgerWorkspace: FC<IngredientsSchema> = ({ ingredients }) => {
  const { setRenderModal } = useModal();
  const ingredientId = useSelector((s: RootState) => s.ingredientId.ingredientId);
  const orderId = useSelector((s: RootState) => s.orderId.orderId);

  useEffect(() => {
    if (ingredientId) {
      const ingredient = ingredients.find(({ _id }) => _id === ingredientId);

      if (ingredient) {
        renderIngredientModal(ingredient)
      }
    }
  }, [ingredientId, ingredients]);

  useEffect(() => {

    if (orderId) {
      renderOrderModal({ id: orderId });
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

    setRenderModal({ render: true, children: <IngredientDetails image_large={image_large} name={name} nutrients={nutrients} /> })
  }, []);

  const renderOrderModal = useCallback(({ id }: OrderDetailsSchema) => {
    setRenderModal({ render: true, children: <OrderDetails id={id} /> })
  }, []);

  return (
    <section className={styles.burgerWorkspaceSection}>
      <Container>
        <Title>Соберите бургер</Title>
        <div className={styles.burgerWorkspace}>
          <BurgerIngredients ingredients={ingredients} />
          <BurgerConstructor />
        </div>
      </Container>
      <Modal />
    </section>
  )
};

export { BurgerWorkspace };

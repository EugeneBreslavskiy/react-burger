import React, { FC, useCallback, useEffect, useRef } from "react";
import {
  OrderDetailsSchema
} from "../../types/ingredients";
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useModal } from "../../context/ModalContext/ModalContext";
import { Title } from "../Title/Title";
import { Container } from "../Container/Container";
import { BurgerIngredients } from "../BurgerIngredients/BurgerIngredients";
import { BurgerConstructor } from "../BurgerConstructor/BurgerConstructor";
import { Modal } from "../Modal/Modal";
import { OrderDetails } from "../OrderDetails/OrderDetails";
import { clearConstructor } from '../../services/constructorSlice';

import styles from "./burger-constructor.module.css";

const BurgerWorkspace: FC = () => {
  const { setRenderModal, renderModal } = useModal();
  const dispatch = useAppDispatch();
  const orderId = useAppSelector((state) => state.orderId.orderId);
  const prevOrderIdRef = useRef<string | undefined>(undefined);

  const renderOrderModal = useCallback(({ id }: OrderDetailsSchema) => {
    setRenderModal({ render: true, children: <OrderDetails id={id} /> })
  }, [setRenderModal]);

  useEffect(() => {
    if (orderId) {
      renderOrderModal({ id: orderId });
      prevOrderIdRef.current = orderId;
    }
  }, [orderId, renderOrderModal]);

  useEffect(() => {
    if (prevOrderIdRef.current && !orderId && !renderModal?.render) {
      dispatch(clearConstructor());
      prevOrderIdRef.current = undefined;
    }
  }, [orderId, renderModal, dispatch]);

  return (
    <section className={styles.burgerWorkspaceSection}>
      <Container>
        <Title>Соберите бургер</Title>
        <div className={styles.burgerWorkspace}>
          <BurgerIngredients />
          <BurgerConstructor />
        </div>
      </Container>
      <Modal />
    </section>
  )
};

export { BurgerWorkspace };

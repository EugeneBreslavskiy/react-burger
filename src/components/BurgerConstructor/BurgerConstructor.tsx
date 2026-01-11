import React, { FC, SyntheticEvent, useEffect, useMemo, useRef, useCallback } from 'react';
import { ConstructorElement, Button, DragIcon } from "@ya.praktikum/react-developer-burger-ui-components";
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { setOrderId as setOrderIdAction, clearOrderId } from '../../services/orderIdSlice';
import { BurgerCredit } from "../BurgerCredit/BurgerCredit";
import { CustomScrollBar } from "../CustomScrollBar/CustomScrollBar";
import { useDrop, useDrag } from 'react-dnd';
import { addIngredient, removeIngredient, moveIngredient, clearConstructor } from '../../services/constructorSlice';
import { createOrder } from '../../services/orderSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import type { IngredientSchema } from '../../types/ingredients';
import type { ConstructorItem } from '../../services/constructorSlice';

import styles from './burger-constructor.module.css';

const BurgerConstructor: FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const constructorState = useAppSelector((state) => state.burgerConstructor);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const orderLoading = useAppSelector((state) => state.order.loading);

  useEffect(() => {
    return () => {
      dispatch(clearOrderId());
    }
  }, [dispatch]);

  const [{ isOver }, dropRef] = useDrop<IngredientSchema, unknown, { isOver: boolean }>(() => ({
    accept: 'INGREDIENT',
    collect: (monitor) => ({ isOver: monitor.isOver() }),
    drop: (item) => {
      const uuid = String(Date.now() + Math.random());
      dispatch(addIngredient({ ...item, uuid }));
    }
  }), [dispatch]);

  const moveItem = useCallback((fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    dispatch(moveIngredient({ fromIndex, toIndex }));
  }, [dispatch]);

  const DraggableConstructorItem: FC<{ item: ConstructorItem, index: number }> = ({ item, index }) => {
    const ref = useRef<HTMLLIElement | null>(null);
    const dispatchLocal = dispatch;

    const [, drop] = useDrop<{ index: number; id: string }, unknown, unknown>({
      accept: 'CONSTRUCTOR_ITEM',
      hover(dragged, monitor) {
        if (!ref.current) return;
        const dragIndex = dragged.index;
        const hoverIndex = index;
        if (dragIndex === hoverIndex) return;
        const hoverBoundingRect = ref.current.getBoundingClientRect();
        const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const clientOffset = monitor.getClientOffset();
        if (!clientOffset) return;
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;
        if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
        if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
        moveItem(dragIndex, hoverIndex);
        dragged.index = hoverIndex;
      }
    });

    const [{ isDragging }, drag] = useDrag({
      type: 'CONSTRUCTOR_ITEM',
      item: () => ({ uuid: item.uuid, index }),
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
      canDrag: () => item.type !== 'bun',
    });

    drag(drop(ref));

    return (
      <li ref={ref} className={styles.BurgerConstructorListItem} style={{ opacity: isDragging ? 0.5 : 1 }}>
        <DragIcon type="primary" />
        <ConstructorElement
          text={item.name}
          price={item.price}
          thumbnail={item.image}
          handleClose={() => {
            if (item.uuid) {
              dispatchLocal(removeIngredient(item.uuid));
            }
          }}
        />
      </li>
    );
  };

  const onSubmitHandler = async (e: SyntheticEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      navigate('/login', { replace: true, state: { from: location } });

      return;
    }

    const ids: string[] = [];
    if (constructorState?.bun) {
      ids.push(constructorState.bun._id, constructorState.bun._id);
    }
    if (constructorState?.items && constructorState.items.length) {
      ids.push(...constructorState.items.map((it) => it._id));
    }

    if (ids.length === 0) return;

    try {
      const orderNumber = await dispatch(createOrder(ids)).unwrap();
      if (orderNumber && orderNumber > 0) {
        dispatch(setOrderIdAction(String(orderNumber)));
        dispatch(clearConstructor());
      }
    } catch (err) {
      console.error('Не удалось оформить заказ', err);
    }
  }

  const totalPrice = useMemo(() => {
    let sum = 0;

    if (constructorState?.bun) sum += constructorState.bun.price * 2;
    if (constructorState?.items?.length) {
      sum += constructorState.items.reduce((acc, it) => acc + (it.price || 0), 0);
    }
    return sum;
  }, [constructorState]);

  return (
    <section>
      <div ref={dropRef} className={styles.BurgerConstructor} style={{ background: isOver ? 'transparent' : undefined }}>
        {constructorState?.bun ? (
          <div className={styles.BurgerConstructorBunWrapper}>
            <ConstructorElement
              type="top"
              isLocked={true}
              text={`${constructorState.bun.name} (верх)`}
              price={constructorState.bun.price}
              thumbnail={constructorState.bun.image}
            />
          </div>
        ) : (
          <div className={styles.BunPlaceholder + ' text text_type_main-default'}>Перетащите булку сверху</div>
        )}
        <CustomScrollBar height={464}>
          <ul className={styles.BurgerConstructorIngredients}>
            {constructorState?.items?.length ? (
              constructorState.items.map((it, i) => (
                <DraggableConstructorItem key={it.uuid ?? `${it._id}_${i}`} item={it} index={i} />
              ))
            ) : (
              <div className={styles.EmptyConstructor + ' text text_type_main-default'}>Перетащите ингредиенты сюда</div>
            )}
          </ul>
        </CustomScrollBar>
        {constructorState?.bun ? (
          <div className={styles.BurgerConstructorBunWrapper}>
            <ConstructorElement
              type="bottom"
              isLocked={true}
              text={`${constructorState.bun.name} (низ)`}
              price={constructorState.bun.price}
              thumbnail={constructorState.bun.image}
            />
          </div>
        ) : (
          <div className={styles.BunPlaceholder + ' text text_type_main-default'}>Перетащите булку снизу</div>
        )}
      </div>
      <form className={styles.BurgerConstructorForm}>
        <BurgerCredit amount={totalPrice} />
        <Button
          htmlType="button"
          type="primary"
          size="large"
          onClick={onSubmitHandler}
          disabled={!constructorState?.bun || orderLoading === 'pending'}
        >
          Оформить заказ
        </Button>
      </form>
    </section>
  );
};

export { BurgerConstructor };

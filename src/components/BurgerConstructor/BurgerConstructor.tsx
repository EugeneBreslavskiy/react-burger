import React, {FC, SyntheticEvent, useEffect, useMemo, useRef, useCallback} from 'react';
import {ConstructorElement, Button} from "@ya.praktikum/react-developer-burger-ui-components";
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../services/store';
import { setOrderId as setOrderIdAction, clearOrderId } from '../../services/orderIdSlice';
import {BurgerCredit} from "../BurgerCredit/BurgerCredit";
import {CustomScrollBar} from "../CustomScrollBar/CustomScrollBar";
import { useDrop, useDrag } from 'react-dnd';
import { addIngredient, removeIngredient, moveIngredient } from '../../services/constructorSlice';
import { createOrder } from '../../services/orderSlice';

import styles from './burger-constructor.module.css';

const BurgerConstructor: FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const constructorState = useSelector((s: RootState) => s.burgerConstructor);

    useEffect(() => {
        return () => {
            dispatch(clearOrderId());
        }
    }, [dispatch]);

    const [{ isOver }, dropRef] = useDrop(() => ({
        accept: 'INGREDIENT',
        collect: (monitor) => ({ isOver: monitor.isOver() }),
        drop: (item: any) => {
            const uuid = String(Date.now() + Math.random());
            if (item.type === 'bun') {
                dispatch(addIngredient({ ...item, uuid }));
            } else {
                dispatch(addIngredient({ ...item, uuid }));
            }
        }
    }), [dispatch]);

    const moveItem = useCallback((fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex) return;
        dispatch(moveIngredient({ fromIndex, toIndex }));
    }, [dispatch]);

    // Draggable item component for reordering
    const DraggableConstructorItem: FC<{item: any, index: number}> = ({ item, index }) => {
        const ref = useRef<HTMLLIElement | null>(null);
        const dispatchLocal = dispatch;

        const [, drop] = useDrop({
            accept: 'CONSTRUCTOR_ITEM',
            hover(dragged: any, monitor) {
                if (!ref.current) return;
                const dragIndex = dragged.index;
                const hoverIndex = index;
                if (dragIndex === hoverIndex) return;
                const hoverBoundingRect = ref.current.getBoundingClientRect();
                const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
                const clientOffset = monitor.getClientOffset();
                if (!clientOffset) return;
                const hoverClientY = clientOffset.y - hoverBoundingRect.top;
                // only perform the move when the mouse has crossed half of the item's height
                if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
                if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
                // perform the move
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
                <ConstructorElement
                    text={item.name}
                    price={item.price}
                    thumbnail={item.image}
                    handleClose={() => dispatchLocal(removeIngredient(item.uuid))}
                />
            </li>
        );
    };

    const onSubmitHandler = async (e: SyntheticEvent) => {
        e.preventDefault();

        // Собираем список _id для отправки на сервер: bun дважды + остальные ингредиенты
        const ids: string[] = [];
        if (constructorState?.bun) {
            ids.push(constructorState.bun._id, constructorState.bun._id);
        }
        if (constructorState?.items && constructorState.items.length) {
            ids.push(...constructorState.items.map((it: any) => it._id));
        }

        if (ids.length === 0) {
            // ничего не отправляем
            return;
        }

        try {
            console.debug('Order IDs to send:', ids);
            const orderNumber = await dispatch(createOrder(ids)).unwrap();
            console.debug('createOrder payload (orderNumber):', orderNumber);
            if (orderNumber && orderNumber > 0) {
                dispatch(setOrderIdAction(String(orderNumber)));
            }
        } catch (err) {
            // thunk rejected — логируем ошибку для отладки
            console.error('Order creation failed', err);
        }
    }

    const totalPrice = useMemo(() => {
        let sum = 0;

        if (constructorState?.bun) sum += constructorState.bun.price * 2;
        if (constructorState?.items?.length) {
            sum += constructorState.items.reduce((acc: number, it: any) => acc + (it.price || 0), 0);
        }
        return sum;
    }, [constructorState]);

    return (
        <section>
            <div ref={dropRef as any} className={styles.BurgerConstructor} style={{ background: isOver ? 'transparent' : undefined }}>
                {constructorState?.bun ? (
                    <ConstructorElement
                        type="top"
                        isLocked={true}
                        text={constructorState.bun.name}
                        price={constructorState.bun.price}
                        thumbnail={constructorState.bun.image}
                    />
                ) : (
                    <div className={styles.BunPlaceholder + ' text text_type_main-default'}>Перетащите булку сверху</div>
                )}
                <CustomScrollBar height={464}>
                    <ul className={styles.BurgerConstructorIngredients}>
                        {/* render only added items */}
                        {constructorState?.items?.length ? (
                            constructorState.items.map((it: any, i: number) => (
                                <DraggableConstructorItem key={it.uuid ?? `${it._id}_${i}`} item={it} index={i} />
                            ))
                        ) : (
                            <div className={styles.EmptyConstructor + ' text text_type_main-default'}>Перетащите ингредиенты сюда</div>
                        )}
                    </ul>
                </CustomScrollBar>
                {constructorState?.bun ? (
                    <ConstructorElement
                        type="bottom"
                        isLocked={true}
                        text={constructorState.bun.name}
                        price={constructorState.bun.price}
                        thumbnail={constructorState.bun.image}
                    />
                ) : (
                    <div className={styles.BunPlaceholder + ' text text_type_main-default'}>Перетащите булку снизу</div>
                )}
            </div>
            <form className={styles.BurgerConstructorForm}>
                <BurgerCredit amount={totalPrice}/>
                <Button htmlType="button" type="primary" size="large" onClick={onSubmitHandler}>
                    Оформить заказ
                </Button>
            </form>
        </section>
    );
};

export {BurgerConstructor};

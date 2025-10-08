import React, {FC, SyntheticEvent, useEffect, useMemo} from 'react';
import {IngredientsSchema} from "../../types/ingredients";
import {useOrderId} from "../../context/OrderContext/OrderContext";
import {BurgerConstructorIngredient} from "../BurgerConstructorIngredient/BurgerConstructorIngredient";
import {BurgerCredit} from "../BurgerCredit/BurgerCredit";
import {CustomScrollBar} from "../CustomScrollBar/CustomScrollBar";

import styles from './burger-constructor.module.css';

const BurgerConstructor: FC<IngredientsSchema> = ({ingredients}) => {
    const {setOrderId} = useOrderId();
    const _ingredients = useMemo(() => [5, 4, 7, 8, 8].map(i => ingredients[i]), [ingredients]);

    useEffect(() => {
        return () => {
            setOrderId(undefined);
        }
    }, []);

    const onSubmitHandler = (e: SyntheticEvent) => {
        e.preventDefault();

        setOrderId('034536');
    }

    return (
        <>
            <section>
                <div className={styles.BurgerConstructor}>
                    <BurgerConstructorIngredient bun={'top'} locked={true} {...ingredients[0]}/>
                    <CustomScrollBar height={464}>
                        <ul className={styles.BurgerConstructorIngredients}>
                            {_ingredients.map((ingredient, i) =>
                                <li key={String(`${ingredient._id}_${i}`)}>
                                    <BurgerConstructorIngredient {...ingredient}/>
                                </li>
                            )}
                        </ul>
                    </CustomScrollBar>
                    <BurgerConstructorIngredient bun={'bottom'} locked={true} {...ingredients[0]}/>
                </div>
                <form className={styles.BurgerConstructorForm} onSubmit={onSubmitHandler}>
                    <BurgerCredit amount={610}/>
                    <button type={'submit'} className={`${styles.BurgerConstructorButton} text text_type_main-default`}>
                        Оформить заказ
                    </button>
                </form>
            </section>
        </>
    );
};

export {BurgerConstructor};

import React, {FC, SyntheticEvent, useEffect, useMemo} from 'react';
import {ConstructorElement, Button} from "@ya.praktikum/react-developer-burger-ui-components";
import {IngredientsSchema} from "../../types/ingredients";
import {useOrderId} from "../../context/OrderContext/OrderContext";
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

        console.log('axaxa')

        setOrderId('034536');
    }

    return (
        <section>
            <div className={styles.BurgerConstructor}>
                <ConstructorElement
                    type="top"
                    isLocked={true}
                    text={ingredients[0].name}
                    price={ingredients[0].price}
                    thumbnail={ingredients[0].image}
                />
                <CustomScrollBar height={464}>
                    <ul className={styles.BurgerConstructorIngredients}>
                        {_ingredients.map(({_id, name, price, image}, i) =>
                            <ConstructorElement
                                key={String(`${_id}_${i}`)}
                                text={name}
                                price={price}
                                thumbnail={image}
                            />
                        )}
                    </ul>
                </CustomScrollBar>
                <ConstructorElement
                    type="bottom"
                    isLocked={true}
                    text={ingredients[0].name}
                    price={ingredients[0].price}
                    thumbnail={ingredients[0].image}
                />
            </div>
            <form className={styles.BurgerConstructorForm}>
                <BurgerCredit amount={610}/>
                <Button htmlType="button" type="primary" size="large" onClick={onSubmitHandler}>
                    Оформить заказ
                </Button>
            </form>
        </section>
    );
};

export {BurgerConstructor};

import {FC, useMemo} from 'react';
import {IngredientsSchema} from "../../types/ingredients";
import {BurgerConstructorIngredient} from "../BurgerConstructorIngredient/BurgerConstructorIngredient";
import {BurgerCredit} from "../BurgerCredit/BurgerCredit";
import {CustomScrollBar} from "../CustomScrollBar/CustomScrollBar";

import styles from './burger-constructor.module.css';

const BurgerConstructor: FC<IngredientsSchema> = ({ingredients}) => {
    const _ingredients = useMemo(() => [5, 4, 7, 8, 8].map(i => ingredients[i]), [ingredients])

    return (
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
            <form className={styles.BurgerConstructorForm}>
                <BurgerCredit amount={610}/>
                <button className={`${styles.BurgerConstructorButton} text text_type_main-default`}>Оформить заказ
                </button>
            </form>
        </section>
    );
};

export {BurgerConstructor};

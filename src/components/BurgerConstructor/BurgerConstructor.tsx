import {FC} from 'react';
import {IngredientsSchema} from "../../types/ingredients";
import {BurgerConstructorIngredient} from "../BurgerConstructorIngredient/BurgerConstructorIngredient";
import {BurgerCredit} from "../BurgerCredit/BurgerCredit";

import styles from './burger-constructor.module.css';
import {CustomScrollBar} from "../CustomScrollBar/CustomScrollBar";

const BurgerConstructor: FC<IngredientsSchema> = ({ingredients}) => {
    return (
        <section>
            <div className={styles.BurgerConstructor}>
                <BurgerConstructorIngredient bun={'top'} locked={true} {...ingredients[0]}/>
                <CustomScrollBar height={464}>
                    <ul className={styles.BurgerConstructorIngredients}>
                        <li>
                            <BurgerConstructorIngredient {...ingredients[5]}/>
                        </li>
                        <li>
                            <BurgerConstructorIngredient {...ingredients[4]}/>
                        </li>
                        <li>
                            <BurgerConstructorIngredient {...ingredients[7]}/>
                        </li>
                        <li>
                            <BurgerConstructorIngredient {...ingredients[8]}/>
                        </li>
                        <li>
                            <BurgerConstructorIngredient {...ingredients[8]}/>
                        </li>
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

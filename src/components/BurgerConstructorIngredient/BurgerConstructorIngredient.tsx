import {FC} from 'react';
import {DeleteIcon, LockIcon} from "@ya.praktikum/react-developer-burger-ui-components";
import {BurgerCredit} from "../BurgerCredit/BurgerCredit";

import styles from './burger-constructor-ingredient.module.css';

type BunType = 'top' | 'bottom'

interface IBurgerConstructorIngredient {
    bun?: 'top' | 'bottom';
    image: string;
    name: string;
    price: number;
    locked?: boolean;
}

const getBunType = (bun?: BunType) => {
    switch (bun) {
        case 'top':
            return '(верх)';
        case 'bottom':
            return '(низ)'
        default:
            return '';
    }
}

const BurgerConstructorIngredient: FC<IBurgerConstructorIngredient> = ({bun, image, name, price, locked}) => {
    return (
        <div className={styles.burgerConstructorIngredientContainer}>
            <span className={`${styles.burgerConstructorIngredient} ${styles[`${bun}`]}`}>
                <img className={styles.burgerIngredientImage} src={image} alt={name}/>
                <p className={`${styles.burgerIngredientName} text text_type_main-default`}>
                    {`${name} ${getBunType(bun)}`}
                </p>
                <span className={styles.burgerIngredientPrice}>
                     <BurgerCredit amount={price}/>
                </span>
                <span className={styles.burgerIngredientNameIcon}>
                   {locked ? <LockIcon type="secondary"/> : <DeleteIcon type="primary" />}
                </span>
            </span>
        </div>
    );
};

export { BurgerConstructorIngredient };

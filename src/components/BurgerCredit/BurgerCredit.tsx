import {FC} from 'react';
import {CurrencyIcon} from "@ya.praktikum/react-developer-burger-ui-components";

import styles from './burger-credit.module.css'

interface IBurgerCredit {
    amount: number;
}

const BurgerCredit: FC<IBurgerCredit> = ({amount}) => {
    return (
        <div className={styles.burgerCredit}>
            <span className="text text_type_digits-default">{amount}</span>
            <CurrencyIcon type="primary"/>
        </div>
    );
};

export {BurgerCredit };

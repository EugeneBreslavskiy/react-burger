import {FC, useEffect} from 'react';
import {BurgerOrderDetailsSchema} from "../../types/ingredients";
import DoneIcon from '../../images/done.svg'
import {useOrderId} from "../../context/OrderContext/OrderContext";

import styles from './burger-order-details.module.css';

const BurgerOrderDetails: FC<BurgerOrderDetailsSchema> = ({id}) => {
    const {setOrderId} = useOrderId();

    useEffect(() => {
        return () => {
            setOrderId(undefined);
        }
    }, []);

    return (
        <section className={styles.burgerOrderDetails}>
            <div className={styles.burgerOrderIdContainer}>
                <p className={`text text_type_digits-large ${styles.burgerOrderId}`}>
                    {id}
                </p>
                <p className={`text text_type_main-medium ${styles.burgerOrderIdText}`}>
                    идентификатор заказа
                </p>
            </div>
            <img alt={"Статус заказа"} src={DoneIcon} className={styles.burgerOrderStatusImage}/>
            <div className={styles.burgerOrderStatusTextContainer}>
                <p className={`text text_type_main-small ${styles.burgerOrderStatusText}`}>
                    Ваш заказ начали готовить
                </p>
                <p className={`text text_type_main-small text_color_inactive ${styles.burgerOrderStatusText}`}>
                    Дождитесь готовности на орбитальной станции
                </p>
            </div>
        </section>
    )
}

export {BurgerOrderDetails};

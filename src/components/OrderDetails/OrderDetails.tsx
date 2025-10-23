import {FC, useEffect} from 'react';
import {OrderDetailsSchema} from "../../types/ingredients";
import DoneIcon from '../../images/done.svg'
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../services/store';
import { clearOrderId } from '../../services/orderIdSlice';

import styles from './order-details.module.css';

const OrderDetails: FC<OrderDetailsSchema> = ({id}) => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        return () => {
            dispatch(clearOrderId());
        }
    }, [dispatch]);

    return (
        <section className={styles.orderDetails}>
            <div className={styles.orderIdContainer}>
                <p className={`text text_type_digits-large ${styles.orderId}`}>
                    {id}
                </p>
                <p className={`text text_type_main-medium ${styles.orderIdText}`}>
                    идентификатор заказа
                </p>
            </div>
            <img alt={"Статус заказа"} src={DoneIcon} className={styles.orderStatusImage}/>
            <div className={styles.orderStatusTextContainer}>
                <p className={`text text_type_main-small ${styles.orderStatusText}`}>
                    Ваш заказ начали готовить
                </p>
                <p className={`text text_type_main-small text_color_inactive ${styles.orderStatusText}`}>
                    Дождитесь готовности на орбитальной станции
                </p>
            </div>
        </section>
    )
}

export {OrderDetails};

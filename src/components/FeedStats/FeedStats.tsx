import { FC, useMemo } from 'react';
import { useAppSelector } from '../../hooks/redux';
import { Order } from '../../services/ordersWebSocketSlice';
import { CustomScrollBar } from '../CustomScrollBar/CustomScrollBar';
import styles from './FeedStats.module.css';

export const FeedStats: FC = () => {
  const { orders, total, totalToday } = useAppSelector(
    (state) => state.ordersWebSocket
  );

  const { ready, inProgress } = useMemo(() => {
    const readyOrders: number[] = [];
    const inProgressOrders: number[] = [];

    orders.forEach((order: Order) => {
      if (order.status === 'done') {
        readyOrders.push(order.number);
      } else if (order.status === 'pending' || order.status === 'created') {
        inProgressOrders.push(order.number);
      }
    });

    return {
      ready: readyOrders.slice(0, 20),
      inProgress: inProgressOrders.slice(0, 20),
    };
  }, [orders]);

  return (
    <div className={styles.statsContainer}>
      <div className={styles.statsGrid}>
        <div className={styles.statsSection}>
          <h2 className={`text text_type_main-medium ${styles.statsTitle}`}>Готовы:</h2>
          <CustomScrollBar height={158}>
            <div className={styles.statsList}>
              {ready.map((number) => (
                <p
                  key={number}
                  className={`text text_type_digits-default text_color_success ${styles.statsNumber}`}
                >
                  {String(number).padStart(6, '0')}
                </p>
              ))}
            </div>
          </CustomScrollBar>
        </div>

        <div className={styles.statsSection}>
          <h2 className={`text text_type_main-medium ${styles.statsTitle}`}>В работе:</h2>
          <CustomScrollBar height={158}>
            <div className={styles.statsList}>
              {inProgress.map((number) => (
                <p
                  key={number}
                  className={`text text_type_digits-default ${styles.statsNumber}`}
                >
                  {String(number).padStart(6, '0')}
                </p>
              ))}
            </div>
          </CustomScrollBar>
        </div>
      </div>

      <div className={styles.statsSection}>
        <h2 className={`text text_type_main-medium ${styles.statsTitle}`}>
          Выполнено за все время:
        </h2>
        <p className={`text text_type_digits-large ${styles.statsNumber}`}>
          {total.toLocaleString('ru-RU')}
        </p>
      </div>

      <div className={styles.statsSection}>
        <h2 className={`text text_type_main-medium ${styles.statsTitle}`}>
          Выполнено за сегодня:
        </h2>
        <p className={`text text_type_digits-large ${styles.statsNumber}`}>
          {totalToday.toLocaleString('ru-RU')}
        </p>
      </div>
    </div>
  );
};


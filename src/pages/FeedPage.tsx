import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../services/store';
import { connectFeedWebSocket, disconnectFeedWebSocket } from '../services/ordersWebSocketSlice';
import { Container } from '../components/Container/Container';
import { Order } from '../services/ordersWebSocketSlice';
import { OrderCard } from '../components/OrderCard/OrderCard';
import { FeedStats } from '../components/FeedStats/FeedStats';
import { CustomScrollBar } from '../components/CustomScrollBar/CustomScrollBar';
import styles from './FeedPage.module.css';

export const FeedPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { orders } = useSelector(
    (state: RootState) => state.ordersWebSocket
  );

  useEffect(() => {
    dispatch(connectFeedWebSocket());

    return () => {
      dispatch(disconnectFeedWebSocket());
    };
  }, [dispatch]);

  return (
    <section className={styles.feedWorkspaceSection}>
      <Container>
        <h1 className={`text text_type_main-large ${styles.feedTitle}`}>Лента заказов</h1>

        <div className={styles.feedContainer}>
          <div className={styles.feedList}>
            <CustomScrollBar height={852}>
              <div className={styles.feedOrders}>
                {orders.length === 0 && (
                  <p className="text text_type_main-default text_color_inactive">
                    Загрузка заказов...
                  </p>
                )}

                {orders.map((order: Order) => (
                  <OrderCard key={order._id} order={order} basePath="/feed" />
                ))}
              </div>
            </CustomScrollBar>
          </div>

          <FeedStats />
        </div>
      </Container>
    </section>
  );
};


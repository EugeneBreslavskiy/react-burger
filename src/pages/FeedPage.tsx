import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { connectFeedWebSocket, disconnectFeedWebSocket, setConnected, setDisconnected, setOrders } from '../services/ordersWebSocketSlice';
import { Container } from '../components/Container/Container';
import { Order } from '../services/ordersWebSocketSlice';
import { OrderCard } from '../components/OrderCard/OrderCard';
import { FeedStats } from '../components/FeedStats/FeedStats';
import { CustomScrollBar } from '../components/CustomScrollBar/CustomScrollBar';
import styles from './FeedPage.module.css';

export const FeedPage = () => {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector(
    (state) => state.ordersWebSocket
  );

  useEffect(() => {
    const feedUrl = 'wss://norma.education-services.ru/orders/all';
    dispatch(connectFeedWebSocket({
      url: feedUrl,
      onConnected: () => setConnected(),
      onDisconnected: () => setDisconnected(),
      onMessage: (data) => {
        if (data && typeof data === 'object' && 'orders' in data && Array.isArray(data.orders)) {
          return setOrders({
            orders: data.orders as Order[],
            total: (data as { total?: number }).total || 0,
            totalToday: (data as { totalToday?: number }).totalToday || 0,
          });
        }
        return null;
      },
    }));

    return () => {
      dispatch(disconnectFeedWebSocket({ url: feedUrl }));
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


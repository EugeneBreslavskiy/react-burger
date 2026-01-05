import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { connectUserWebSocket, disconnectUserWebSocket, setUserConnected, setUserDisconnected, setUserOrders } from '../services/ordersWebSocketSlice';
import { getCookie } from '../utils/cookies';
import { PageSection } from '../components/PageSection/PageSection';
import { Container } from '../components/Container/Container';
import { ProfileLayout } from '../components/ProfileLayout/ProfileLayout';
import { ProfileSidebar } from '../components/ProfileSidebar/ProfileSidebar';
import { Order } from '../services/ordersWebSocketSlice';
import { OrderCard } from '../components/OrderCard/OrderCard';
import { CustomScrollBar } from '../components/CustomScrollBar/CustomScrollBar';
import pageSectionStyles from '../components/PageSection/PageSection.module.css';
import styles from './ProfileOrdersPage.module.css';

export const ProfileOrdersPage = () => {
  const dispatch = useAppDispatch();
  const { userOrders } = useAppSelector(
    (state) => state.ordersWebSocket
  );

  useEffect(() => {
    const token = getCookie('accessToken');
    const cleanToken = token ? token.replace(/^Bearer\s+/i, '') : '';
    const userUrl = `wss://norma.education-services.ru/orders${cleanToken ? `?token=${cleanToken}` : ''}`;

    dispatch(connectUserWebSocket({
      url: userUrl,
      onConnected: () => setUserConnected(),
      onDisconnected: () => setUserDisconnected(),
      onMessage: (data) => {
        if (data && typeof data === 'object' && 'orders' in data && Array.isArray(data.orders)) {
          return setUserOrders({
            orders: data.orders as Order[],
            total: (data as { total?: number }).total || 0,
            totalToday: (data as { totalToday?: number }).totalToday || 0,
          });
        }
        return null;
      },
    }));

    return () => {
      dispatch(disconnectUserWebSocket({ url: userUrl }));
    };
  }, [dispatch]);

  return (
    <PageSection className={pageSectionStyles.pageSectionWithPadding}>
      <Container>
        <ProfileLayout sidebar={<ProfileSidebar />}>
          <div className={styles.ordersContent}>
            <h1 className={`text text_type_main-large ${styles.ordersTitle}`}>История заказов</h1>

            <CustomScrollBar height={852}>
              <div className={styles.ordersList}>
                {userOrders.length === 0 && (
                  <p className="text text_type_main-default text_color_inactive">
                    Загрузка заказов...
                  </p>
                )}

                {userOrders.map((order: Order) => (
                  <OrderCard key={order._id} order={order} basePath="/profile/orders" />
                ))}
              </div>
            </CustomScrollBar>
          </div>
        </ProfileLayout>
      </Container>
    </PageSection>
  );
};



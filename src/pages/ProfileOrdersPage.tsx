import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../services/store';
import { connectUserWebSocket, disconnectUserWebSocket } from '../services/ordersWebSocketSlice';
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
  const dispatch = useDispatch<AppDispatch>();
  const { userOrders } = useSelector(
    (state: RootState) => state.ordersWebSocket
  );

  useEffect(() => {
    dispatch(connectUserWebSocket());

    return () => {
      dispatch(disconnectUserWebSocket());
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



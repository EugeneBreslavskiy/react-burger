import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { Order, fetchOrderByNumber } from '../services/ordersWebSocketSlice';
import { PageSection } from '../components/PageSection/PageSection';
import { Container } from '../components/Container/Container';
import { OrderDetailsContent } from '../components/OrderDetailsContent/OrderDetailsContent';
import pageSectionStyles from '../components/PageSection/PageSection.module.css';

export const ProfileOrderPage = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useAppDispatch();
  const { userOrders, currentOrder, loading } = useAppSelector(
    (state) => state.ordersWebSocket
  );
  const ingredients = useAppSelector((state) => state.ingredients.items);

  const order = useMemo(() => {
    if (!number) return null;

    const orderNumber = parseInt(number, 10);

    const wsOrder = userOrders.find((o: Order) => o.number === orderNumber);
    if (wsOrder) return wsOrder;

    if (currentOrder && currentOrder.number === orderNumber) {
      return currentOrder;
    }

    return null;
  }, [number, userOrders, currentOrder]);

  useEffect(() => {
    if (number && !order) {
      const orderNumber = parseInt(number, 10);

      if (!isNaN(orderNumber)) {
        dispatch(fetchOrderByNumber(orderNumber));
      }
    }
  }, [number, order, dispatch]);

  if (loading) {
    return (
      <PageSection className={pageSectionStyles.pageSectionWithPadding}>
        <Container>
          <p className="text text_type_main-default">Загрузка...</p>
        </Container>
      </PageSection>
    );
  }

  if (!order) {
    return (
      <PageSection className={pageSectionStyles.pageSectionWithPadding}>
        <Container>
          <p className="text text_type_main-default">Заказ не найден</p>
        </Container>
      </PageSection>
    );
  }

  return (
    <PageSection className={pageSectionStyles.pageSectionWithPadding}>
      <Container>
        <OrderDetailsContent order={order} ingredients={ingredients} />
      </Container>
    </PageSection>
  );
};


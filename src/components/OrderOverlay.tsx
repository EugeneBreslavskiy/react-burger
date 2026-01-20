import { useEffect, useMemo, FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { Order, fetchOrderByNumber } from '../services/ordersWebSocketSlice';
import { OrderDetailsContent } from './OrderDetailsContent/OrderDetailsContent';
import { useModal } from '../context/ModalContext/ModalContext';

export const OrderOverlay: FC = () => {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { orders, userOrders, currentOrder } = useAppSelector(
    (state) => state.ordersWebSocket
  );
  const ingredients = useAppSelector((state) => state.ingredients.items);
  const { setRenderModal } = useModal();

  const order = useMemo(() => {
    if (!number) return null;
    const orderNumber = parseInt(number, 10);

    // Ищем заказ сначала в ленте заказов, затем в истории пользователя
    const wsOrder = orders.find((o: Order) => o.number === orderNumber);
    if (wsOrder) return wsOrder;

    const userOrder = userOrders.find((o: Order) => o.number === orderNumber);
    if (userOrder) return userOrder;

    if (currentOrder && currentOrder.number === orderNumber) {
      return currentOrder;
    }

    return null;
  }, [number, orders, userOrders, currentOrder]);

  useEffect(() => {
    if (number && !order) {
      const orderNumber = parseInt(number, 10);
      if (!isNaN(orderNumber)) {
        dispatch(fetchOrderByNumber(orderNumber));
      }
    }
  }, [number, order, dispatch]);

  useEffect(() => {
    if (!order) return;

    // Функция закрытия модального окна с навигацией назад по истории
    const handleClose = () => {
      navigate(-1);
    };

    setRenderModal({
      render: true,
      children: <OrderDetailsContent order={order} ingredients={ingredients} />,
      onClose: handleClose
    });

    return () => {
      // Cleanup при размонтировании компонента
      setRenderModal({ render: false, children: null, onClose: undefined });
    };
  }, [setRenderModal, order, ingredients, navigate]);

  return null;
};

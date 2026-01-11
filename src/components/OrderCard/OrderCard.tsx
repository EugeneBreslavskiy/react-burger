import { FC, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { Order } from '../../services/ordersWebSocketSlice';
import { useAppSelector } from '../../hooks/redux';
import styles from './OrderCard.module.css';

interface OrderCardProps {
  order: Order;
  basePath?: string;
}

export const OrderCard: FC<OrderCardProps> = ({ order, basePath = '/feed' }) => {
  const ingredients = useAppSelector((state) => state.ingredients.items);

  const orderIngredients = useMemo(() => {
    if (!ingredients.length || !order.ingredients) return [];

    const uniqueIds = Array.from(new Set(order.ingredients));
    const uniqueIngredients = uniqueIds
      .map(id => ingredients.find(ing => ing._id === id))
      .filter(Boolean);

    return uniqueIngredients.slice(0, 6);
  }, [order.ingredients, ingredients]);

  const totalPrice = useMemo(() => {
    if (!ingredients.length || !order.ingredients) return 0;

    return order.ingredients.reduce((sum, id) => {
      const ingredient = ingredients.find(ing => ing._id === id);
      return sum + (ingredient?.price || 0);
    }, 0);
  }, [order.ingredients, ingredients]);

  const uniqueIngredientsCount = useMemo(() => {
    if (!order.ingredients) return 0;
    return Array.from(new Set(order.ingredients)).length;
  }, [order.ingredients]);

  const remainingCount = uniqueIngredientsCount > 6 ? uniqueIngredientsCount - 6 : 0;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const orderDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (orderDate.getTime() === today.getTime()) {
      return `Сегодня, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (orderDate.getTime() === yesterday.getTime()) {
      return `Вчера, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    }

    const daysDiff = Math.floor((today.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDiff === 2) {
      return `2 дня назад, ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
    }

    return `${date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
    })} в ${date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const getStatusText = () => {
    if (order.status === 'done') return 'Выполнен';
    if (order.status === 'pending') return 'Готовится';
    if (order.status === 'created') return 'Создан';
    return order.status;
  };

  const getStatusClass = () => {
    if (order.status === 'done') return 'text_color_success';
    return '';
  };

  return (
    <Link
      to={`${basePath}/${order.number}`}
      className={styles.orderCard}
    >
      <div className={styles.orderHeader}>
        <p className={`text text_type_digits-default ${styles.orderNumber}`}>
          #{String(order.number).padStart(6, '0')}
        </p>
        <p className={`text text_type_main-default text_color_inactive ${styles.orderTime}`}>
          {formatDate(order.createdAt)}
        </p>
      </div>

      <h3 className={`text text_type_main-medium ${styles.orderName}`}>
        {order.name}
      </h3>

      {basePath === '/profile/orders' && (
        <p className={`text text_type_main-default ${styles.orderStatus} ${getStatusClass()}`}>
          {getStatusText()}
        </p>
      )}

      <div className={styles.orderFooter}>
        <div className={styles.orderIngredients}>
          {orderIngredients.map((ingredient, index) => {
            const isLast = index === orderIngredients.length - 1;
            const showOverlay = isLast && remainingCount > 0;

            return (
              <div key={ingredient?._id || index} className={styles.ingredientImageWrapper}>
                <img
                  src={ingredient?.image}
                  alt={ingredient?.name}
                  className={styles.ingredientImage}
                />
                {showOverlay && (
                  <div className={styles.ingredientImageOverlay}>
                    +{remainingCount}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.orderPrice}>
          <span className="text text_type_digits-default">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </Link>
  );
};


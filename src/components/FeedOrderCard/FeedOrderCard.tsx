import { FC, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { Order } from '../../services/ordersWebSocketSlice';
import { useSelector } from 'react-redux';
import type { RootState } from '../../services/store';
import styles from './FeedOrderCard.module.css';

interface FeedOrderCardProps {
  order: Order;
}

export const FeedOrderCard: FC<FeedOrderCardProps> = ({ order }) => {
  const ingredients = useSelector((state: RootState) => state.ingredients.items);

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

    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Link
      to={`/feed/${order.number}`}
      className={styles.orderCard}
    >
      <div className={styles.orderHeader}>
        <p className={`text text_type_digits-default ${styles.orderNumber}`}>
          #{order.number}
        </p>
        <p className={`text text_type_main-default text_color_inactive ${styles.orderTime}`}>
          {formatDate(order.createdAt)}
        </p>
      </div>

      <h3 className={`text text_type_main-medium ${styles.orderName}`}>
        {order.name}
      </h3>

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


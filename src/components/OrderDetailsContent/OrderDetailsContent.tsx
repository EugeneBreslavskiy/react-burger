import { FC, useMemo } from 'react';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { Order } from '../../services/ordersWebSocketSlice';
import { IngredientSchema } from '../../types/ingredients';
import { CustomScrollBar } from '../CustomScrollBar/CustomScrollBar';
import styles from './OrderDetailsContent.module.css';

interface OrderDetailsContentProps {
  order: Order;
  ingredients: IngredientSchema[];
}

export const OrderDetailsContent: FC<OrderDetailsContentProps> = ({ order, ingredients }) => {
  const orderIngredients = useMemo(() => {
    if (!ingredients.length || !order.ingredients) return [];

    const ingredientCounts = new Map<string, number>();
    order.ingredients.forEach((id) => {
      ingredientCounts.set(id, (ingredientCounts.get(id) || 0) + 1);
    });

    const uniqueIds = Array.from(new Set(order.ingredients));
    return uniqueIds
      .map((id) => {
        const ingredient = ingredients.find((ing) => ing._id === id);
        if (!ingredient) return null;
        return {
          ingredient,
          count: ingredientCounts.get(id) || 0,
        };
      })
      .filter(Boolean) as Array<{ ingredient: IngredientSchema; count: number }>;
  }, [order.ingredients, ingredients]);

  const totalPrice = useMemo(() => {
    if (!ingredients.length || !order.ingredients) return 0;
    return order.ingredients.reduce((sum, id) => {
      const ingredient = ingredients.find((ing) => ing._id === id);
      return sum + (ingredient?.price || 0);
    }, 0);
  }, [order.ingredients, ingredients]);

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
      minute: '2-digit',
    });
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
    <div className={styles.orderDetails}>
      <p className={`text text_type_digits-default ${styles.orderNumber}`}>
        #{String(order.number).padStart(6, '0')}
      </p>

      <h1 className={`text text_type_main-large ${styles.orderName}`}>{order.name}</h1>

      <p className={`text text_type_main-default ${styles.orderStatus} ${getStatusClass()}`}>
        {getStatusText()}
      </p>

      <div className={styles.orderComposition}>
        <p className={`text text_type_main-medium ${styles.compositionTitle}`}>Состав:</p>
        <CustomScrollBar height={312}>
          <div className={styles.ingredientsList}>
            {orderIngredients.map(({ ingredient, count }) => (
              <div key={ingredient._id} className={styles.ingredientItem}>
                <div className={styles.ingredientImageWrapper}>
                  <img
                    src={ingredient.image_mobile || ingredient.image}
                    alt={ingredient.name}
                    className={styles.ingredientImage}
                  />
                </div>
                <p className={`text text_type_main-default ${styles.ingredientName}`}>
                  {ingredient.name}
                </p>
                <div className={styles.ingredientPrice}>
                  <span className="text text_type_digits-default">
                    {count} x {ingredient.price}
                  </span>
                  <CurrencyIcon type="primary" />
                </div>
              </div>
            ))}
          </div>
        </CustomScrollBar>
      </div>

      <div className={styles.orderFooter}>
        <p className={`text text_type_main-default text_color_inactive ${styles.orderDate}`}>
          {formatDate(order.createdAt)}
        </p>
        <div className={styles.orderTotalPrice}>
          <span className="text text_type_digits-default">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};


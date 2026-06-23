import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { Link, useLocation } from 'react-router-dom';

import { OrderStatus } from '@components/order-status/order-status';
import { OrdersIngredientsIcons } from '@components/orders-ingredients-icons/orders-ingredients-icons';
import { useAppSelector } from '@services/hooks';
import { formatOrderDate } from '@utils/date';
import { getOrderPrice, getUniqueOrderIngredients } from '@utils/order';

import type { TOrder } from '@utils/types';

import styles from './order-card.module.css';

type TOrderCardProps = {
  order: TOrder;
  linkTo: string;
  showStatus?: boolean;
};

export const OrderCard = ({
  order,
  linkTo,
  showStatus = false,
}: TOrderCardProps): React.JSX.Element => {
  const location = useLocation();
  const ingredients = useAppSelector((state) => state.ingredients.items);
  const ingredientsMap = new Map(ingredients.map((item) => [item._id, item]));
  const orderIngredients = getUniqueOrderIngredients(order, ingredientsMap);
  const price = getOrderPrice(order, ingredientsMap);

  return (
    <Link
      to={linkTo}
      state={{ background: location }}
      className={`${styles.card} p-6 mb-2`}
    >
      <div className={styles.header}>
        <span className="text text_type_digits-default">
          #{String(order.number).padStart(6, '0')}
        </span>
        <span className="text text_type_main-default text_color_inactive">
          {formatOrderDate(order.createdAt)}
        </span>
      </div>
      <p className={`${styles.name} text text_type_main-medium`}>
        {order.name ?? 'Бургер'}
      </p>
      {showStatus && <OrderStatus status={order.status} />}
      <div className={styles.footer}>
        <OrdersIngredientsIcons ingredients={orderIngredients} />
        <div className={styles.price}>
          <span className="text text_type_digits-default">{price}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </Link>
  );
};

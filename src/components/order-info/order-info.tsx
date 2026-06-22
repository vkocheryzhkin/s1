import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';

import { OrderStatus } from '@components/order-status/order-status';
import { useAppSelector } from '@services/hooks';
import { formatOrderDate } from '@utils/date';
import { getOrderIngredients, getOrderPrice } from '@utils/order';

import type { TOrder } from '@utils/types';

import styles from './order-info.module.css';

type TOrderInfoProps = {
  order: TOrder;
};

export const OrderInfo = ({ order }: TOrderInfoProps): React.JSX.Element => {
  const ingredients = useAppSelector((state) => state.ingredients.items);
  const ingredientsMap = new Map(ingredients.map((item) => [item._id, item]));
  const orderIngredients = getOrderIngredients(order, ingredientsMap);
  const price = getOrderPrice(order, ingredientsMap);

  return (
    <div className={styles.root}>
      <p className="text text_type_digits-default mb-3">
        #{String(order.number).padStart(6, '0')}
      </p>
      <p className="text text_type_main-medium mb-2">{order.name ?? 'Бургер'}</p>
      <OrderStatus status={order.status} />
      <p className={`${styles.composition} text text_type_main-medium mt-15 mb-6`}>
        Состав:
      </p>
      <ul className={`${styles.ingredients} custom-scroll mb-10`}>
        {orderIngredients.map(({ ingredient, count }) => (
          <li key={ingredient._id} className={styles.ingredient}>
            <div className={styles.ingredient_info}>
              <span className={styles.ingredient_border}>
                <img
                  className={styles.ingredient_image}
                  src={ingredient.image}
                  alt={ingredient.name}
                />
              </span>
              <span className="text text_type_main-default">{ingredient.name}</span>
            </div>
            <div className={styles.ingredient_price}>
              <span className="text text_type_digits-default">
                {count} x {ingredient.price}
              </span>
              <CurrencyIcon type="primary" />
            </div>
          </li>
        ))}
      </ul>
      <div className={styles.footer}>
        <span className="text text_type_main-default text_color_inactive">
          {formatOrderDate(order.createdAt)}
        </span>
        <div className={styles.price}>
          <span className="text text_type_digits-medium">{price}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};

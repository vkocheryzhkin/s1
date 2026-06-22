import { useEffect } from 'react';

import { OrderCard } from '@components/order-card/order-card';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import {
  connectProfileOrders,
  disconnectProfileOrders,
  selectProfileOrders,
} from '@services/profile-orders-slice';

import styles from './profile-orders-page.module.css';

export const ProfileOrdersPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectProfileOrders);

  useEffect(() => {
    dispatch(connectProfileOrders());

    return (): void => {
      dispatch(disconnectProfileOrders());
    };
  }, [dispatch]);

  return (
    <section className={styles.root}>
      <p
        className={`${styles.description} text text_type_main-default text_color_inactive mb-10`}
      >
        В этом разделе вы можете просмотреть свою историю заказов
      </p>
      <div className={`${styles.orders} custom-scroll`}>
        {orders.map((order) => (
          <OrderCard
            key={order._id || order.number}
            order={order}
            linkTo={`/profile/orders/${order.number}`}
            showStatus
          />
        ))}
      </div>
    </section>
  );
};

import { useEffect } from 'react';

import { FeedInfo } from '@components/feed-info/feed-info';
import { OrderCard } from '@components/order-card/order-card';
import { connectFeed, disconnectFeed, selectFeedOrders } from '@services/feed-slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';

import styles from './feed.module.css';

export const FeedPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(selectFeedOrders);

  useEffect(() => {
    dispatch(connectFeed());

    return (): void => {
      dispatch(disconnectFeed());
    };
  }, [dispatch]);

  return (
    <main className={`${styles.container} mt-10 pl-5 pr-5`}>
      <h1 className="text text_type_main-large mb-5">Лента заказов</h1>
      <div className={styles.content}>
        <section className={`${styles.orders} custom-scroll`}>
          {orders.map((order) => (
            <OrderCard
              key={order._id || order.number}
              order={order}
              linkTo={`/feed/${order.number}`}
            />
          ))}
        </section>
        <FeedInfo />
      </div>
    </main>
  );
};

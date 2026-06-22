import { selectFeedOrders } from '@services/feed-slice';
import { useAppSelector } from '@services/hooks';
import { splitOrderNumbers } from '@utils/order';

import styles from './feed-info.module.css';

export const FeedInfo = (): React.JSX.Element => {
  const orders = useAppSelector(selectFeedOrders);
  const { total, totalToday } = useAppSelector((state) => state.feed);

  const readyNumbers = orders
    .filter((order) => order.status === 'done')
    .map((order) => order.number);
  const inProgressNumbers = orders
    .filter((order) => order.status === 'pending' || order.status === 'created')
    .map((order) => order.number)
    .slice(0, 20);

  const readyColumns = splitOrderNumbers(readyNumbers.slice(0, 20));
  const inProgressColumns = splitOrderNumbers(inProgressNumbers);

  return (
    <section className={styles.root}>
      <div className={styles.status_board}>
        <div className={styles.status_group}>
          <h3 className="text text_type_main-medium mb-6">Готовы:</h3>
          <div className={styles.columns}>
            {readyColumns.map((column, columnIndex) => (
              <ul key={`ready-${columnIndex}`} className={styles.numbers}>
                {column.map((number) => (
                  <li
                    key={number}
                    className={`${styles.number} ${styles.number_ready} text text_type_digits-default`}
                  >
                    {String(number).padStart(6, '0')}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <div className={styles.status_group}>
          <h3 className="text text_type_main-medium mb-6">В работе:</h3>
          <div className={styles.columns}>
            {inProgressColumns.map((column, columnIndex) => (
              <ul key={`progress-${columnIndex}`} className={styles.numbers}>
                {column.map((number) => (
                  <li
                    key={number}
                    className={`${styles.number} text text_type_digits-default`}
                  >
                    {String(number).padStart(6, '0')}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.total_block}>
        <h3 className="text text_type_main-medium">Выполнено за все время:</h3>
        <p className={`${styles.total_value} text text_type_digits-large`}>{total}</p>
      </div>
      <div className={styles.total_block}>
        <h3 className="text text_type_main-medium">Выполнено за сегодня:</h3>
        <p className={`${styles.total_value} text text_type_digits-large`}>
          {totalToday}
        </p>
      </div>
    </section>
  );
};

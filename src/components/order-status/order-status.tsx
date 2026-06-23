import { ORDER_STATUS_TEXT } from '@utils/order';

import type { TOrderStatus } from '@utils/types';

import styles from './order-status.module.css';

type TOrderStatusProps = {
  status: TOrderStatus;
};

export const OrderStatus = ({ status }: TOrderStatusProps): React.JSX.Element => {
  const statusClass =
    status === 'done'
      ? styles.done
      : status === 'pending'
        ? styles.pending
        : styles.created;

  return (
    <p className={`${styles.status} text text_type_main-default ${statusClass}`}>
      {ORDER_STATUS_TEXT[status]}
    </p>
  );
};

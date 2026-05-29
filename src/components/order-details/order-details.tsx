import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';

import type { RootState } from '@services/store';

import styles from './order-details.module.css';

export const OrderDetails = (): React.JSX.Element => {
  const {
    number: orderNumber,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.order);

  if (isLoading) {
    return (
      <div className={styles.root}>
        <p className="text text_type_main-medium mt-10 mb-10">Оформляем заказ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.root}>
        <p className="text text_type_main-medium mt-10 mb-10">{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <p className={`${styles.order_id} text text_type_digits-large mb-8`}>
        {orderNumber}
      </p>
      <p className="text text_type_main-medium mb-15">идентификатор заказа</p>
      <div className={`${styles.icon_wrap} mb-15`}>
        <CheckMarkIcon type="primary" />
      </div>
      <p className={`${styles.message} text text_type_main-default mb-2`}>
        Ваш заказ начали готовить
      </p>
      <p className="text text_type_main-default text_color_inactive mb-20">
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};

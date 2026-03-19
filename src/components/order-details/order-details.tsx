import { CheckMarkIcon } from '@krgaa/react-developer-burger-ui-components';

import styles from './order-details.module.css';

const MOCK_ORDER_NUMBER = 12345;

export const OrderDetails = (): React.JSX.Element => {
  return (
    <div className={styles.root}>
      <p className={`${styles.order_id} text text_type_digits-large mb-8`}>
        {MOCK_ORDER_NUMBER}
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

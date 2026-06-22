import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useLocation, useNavigate } from 'react-router-dom';

import { Modal } from '@components/modal/modal';
import { OrderInfo } from '@components/order-info/order-info';
import { useOrderDetails } from '@hooks/useOrderDetails';

import type { Location } from 'react-router-dom';

import styles from './order-info-page.module.css';

type TLocationState = {
  background?: Location;
};

type TOrderInfoModalProps = {
  source: 'feed' | 'profile';
};

export const OrderInfoModal = ({
  source,
}: TOrderInfoModalProps): React.JSX.Element | null => {
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = (location.state as TLocationState | null)?.background;
  const { order, isLoading } = useOrderDetails(source);

  const handleClose = (): void => {
    if (backgroundLocation) {
      void navigate(backgroundLocation.pathname, { replace: true });
      return;
    }

    void navigate(source === 'feed' ? '/feed' : '/profile/orders', { replace: true });
  };

  if (!isLoading && !order) {
    return null;
  }

  return (
    <Modal title="" onClose={handleClose}>
      {isLoading ? (
        <div className={styles.preloader}>
          <Preloader />
        </div>
      ) : (
        order && <OrderInfo order={order} />
      )}
    </Modal>
  );
};

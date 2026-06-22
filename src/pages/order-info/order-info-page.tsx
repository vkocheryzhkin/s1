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

type TOrderInfoPageProps = {
  source: 'feed' | 'profile';
};

const OrderInfoContent = ({ source }: TOrderInfoPageProps): React.JSX.Element | null => {
  const { order, isLoading } = useOrderDetails(source);

  if (isLoading) {
    return (
      <div className={styles.preloader}>
        <Preloader />
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return <OrderInfo order={order} />;
};

export const OrderInfoPage = ({
  source,
}: TOrderInfoPageProps): React.JSX.Element | null => {
  return (
    <main className={styles.page}>
      <OrderInfoContent source={source} />
    </main>
  );
};

export const OrderInfoModal = ({
  source,
}: TOrderInfoPageProps): React.JSX.Element | null => {
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

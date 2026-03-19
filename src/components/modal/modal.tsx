import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '@components/modal-overlay/modal-overlay';

import styles from './modal.module.css';

type TModalProps = {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
};

const modalRoot = document.body;

export const Modal = ({ title, onClose, children }: TModalProps): React.JSX.Element => {
  useEffect(() => {
    const onEsc = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', onEsc);

    return (): void => {
      document.removeEventListener('keydown', onEsc);
    };
  }, [onClose]);

  return createPortal(
    <>
      <ModalOverlay onClick={onClose} />
      <div className={`${styles.modal} p-10`}>
        <div className={`${styles.header} ${!title ? styles.header_end : ''}`}>
          {title && (
            <h2 className={`${styles.title} text text_type_main-large`}>{title}</h2>
          )}
          <button className={styles.close} type="button" onClick={onClose}>
            <CloseIcon type="primary" />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </>,
    modalRoot
  );
};

import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { fetchIngredients } from '@services/ingredients-slice';
import { clearOrder } from '@services/order-slice';

import type { AppDispatch, RootState } from '@services/store';

import styles from './home.module.css';

export const Home = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.ingredients);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  if (isLoading) {
    return (
      <main className={styles.preloader}>
        <Preloader />
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.error}>
        <p className="text text_type_main-medium">{error}</p>
      </main>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor onOpenOrderDetails={() => setIsOrderModalOpen(true)} />
      </main>
      {isOrderModalOpen && (
        <Modal
          onClose={() => {
            setIsOrderModalOpen(false);
            dispatch(clearOrder());
          }}
        >
          <OrderDetails />
        </Modal>
      )}
    </DndProvider>
  );
};

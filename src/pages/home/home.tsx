import { useEffect, useRef, useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useLocation, useNavigate } from 'react-router-dom';

import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { createOrder } from '@services/order/order-actions';
import { clearOrder } from '@services/order/order-slice';

import styles from './home.module.css';

type THomeLocationState = {
  orderIntent?: boolean;
};

export const Home = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { error } = useAppSelector((state) => state.ingredients);
  const bun = useAppSelector((state) => state.burgerConstructor.bun);
  const fillingIngredients = useAppSelector(
    (state) => state.burgerConstructor.ingredients
  );
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const orderIntentProcessed = useRef(false);

  useEffect(() => {
    const orderIntent = (location.state as THomeLocationState | null)?.orderIntent;

    if (!orderIntent || !bun || orderIntentProcessed.current) {
      return;
    }

    orderIntentProcessed.current = true;

    const orderIngredientIds = [
      bun._id,
      ...fillingIngredients.map((ingredient) => ingredient._id),
      bun._id,
    ];

    setIsOrderModalOpen(true);
    void dispatch(createOrder({ ingredients: orderIngredientIds }));
    void navigate('.', { replace: true, state: null });
  }, [bun, dispatch, fillingIngredients, location.state, navigate]);

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

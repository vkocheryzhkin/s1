import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { fetchIngredients } from '@services/ingredients-slice';
import { clearOrder } from '@services/order-slice';
import { clearSelectedIngredient } from '@services/selected-ingredient-slice';

import type { AppDispatch, RootState } from '@services/store';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.ingredients);
  const selectedIngredient = useSelector(
    (state: RootState) => state.selectedIngredient.ingredient
  );
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <main className={styles.preloader}>
          <Preloader />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.app}>
        <AppHeader />
        <main className={styles.error}>
          <p className="text text_type_main-medium">{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients />
        <BurgerConstructor onOpenOrderDetails={() => setIsOrderModalOpen(true)} />
      </main>
      {selectedIngredient && (
        <Modal
          title="Детали ингредиента"
          onClose={() => dispatch(clearSelectedIngredient())}
        >
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      )}
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
    </div>
  );
};

export default App;

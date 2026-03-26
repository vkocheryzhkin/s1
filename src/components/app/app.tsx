import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { useGetIngredientsQuery } from '@services/burger-api';
import { clearSelectedIngredient } from '@services/selected-ingredient-slice';

import type { AppDispatch, RootState } from '@services/store';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: ingredients = [], isLoading, error } = useGetIngredientsQuery();
  const selectedIngredient = useSelector(
    (state: RootState) => state.selectedIngredient.ingredient
  );
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);

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
    const errorMessage =
      'status' in error ? 'Не удалось загрузить ингредиенты' : error.message;

    return (
      <div className={styles.app}>
        <AppHeader />
        <main className={styles.error}>
          <p className="text text_type_main-medium">{errorMessage}</p>
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
        <BurgerIngredients ingredients={ingredients} />
        <BurgerConstructor
          ingredients={ingredients}
          onOpenOrderDetails={() => setIsOrderModalOpen(true)}
        />
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
        <Modal onClose={() => setIsOrderModalOpen(false)}>
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

export default App;

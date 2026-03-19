import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { API_URL } from '@utils/constants';

import type { TIngredient, TIngredientsResponse } from '@utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<TIngredient | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadIngredients = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`${API_URL}/ingredients`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Ошибка загрузки ингредиентов: ${response.status}`);
        }

        const data = (await response.json()) as TIngredientsResponse;

        if (!data.success || !Array.isArray(data.data)) {
          throw new Error('Некорректный ответ от сервера');
        }

        setIngredients(data.data);
      } catch (requestError) {
        if (requestError instanceof Error && requestError.name === 'AbortError') {
          return;
        }

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Не удалось загрузить ингредиенты'
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadIngredients();

    return (): void => {
      controller.abort();
    };
  }, []);

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
        <BurgerIngredients
          ingredients={ingredients}
          onIngredientClick={setSelectedIngredient}
        />
        <BurgerConstructor
          ingredients={ingredients}
          onOpenOrderDetails={() => setIsOrderModalOpen(true)}
        />
      </main>
      {selectedIngredient && (
        <Modal title="Детали ингредиента" onClose={() => setSelectedIngredient(null)}>
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

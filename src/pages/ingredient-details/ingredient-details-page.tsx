import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { useAppSelector } from '@services/hooks';

import type { TIngredient } from '@utils/types';
import type { Location } from 'react-router-dom';

import styles from './ingredient-details-page.module.css';

type TLocationState = {
  background?: Location;
};

const useIngredientById = (): TIngredient | undefined => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useAppSelector((state) => state.ingredients.items);

  return ingredients.find((ingredient) => ingredient._id === id);
};

export const IngredientDetailsPage = (): React.JSX.Element | null => {
  const ingredient = useIngredientById();

  if (!ingredient) {
    return null;
  }

  return (
    <main className={styles.page}>
      <h1 className={`${styles.title} text text_type_main-large mb-8`}>
        Детали ингредиента
      </h1>
      <IngredientDetails ingredient={ingredient} />
    </main>
  );
};

export const IngredientDetailsModal = (): React.JSX.Element | null => {
  const navigate = useNavigate();
  const location = useLocation();
  const backgroundLocation = (location.state as TLocationState | null)?.background;
  const ingredient = useIngredientById();

  if (!ingredient) {
    return null;
  }

  const handleClose = (): void => {
    if (backgroundLocation) {
      void navigate(backgroundLocation.pathname, { replace: true });
      return;
    }

    void navigate(-1);
  };

  return (
    <Modal title="Детали ингредиента" onClose={handleClose}>
      <IngredientDetails ingredient={ingredient} />
    </Modal>
  );
};

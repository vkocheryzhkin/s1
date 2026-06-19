import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';

import type { RootState } from '@services/store';

import styles from './ingredient-details-page.module.css';

const useIngredientById = (): ReturnType<
  typeof useSelector<RootState, RootState['ingredients']['items'][number] | undefined>
> => {
  const { id } = useParams<{ id: string }>();
  const ingredients = useSelector((state: RootState) => state.ingredients.items);

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
  const ingredient = useIngredientById();

  if (!ingredient) {
    return null;
  }

  return (
    <Modal
      title="Детали ингредиента"
      onClose={() => {
        void navigate(-1);
      }}
    >
      <IngredientDetails ingredient={ingredient} />
    </Modal>
  );
};

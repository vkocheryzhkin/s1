import type { TIngredient } from '@utils/types';

import styles from './ingredient-details.module.css';

type TIngredientDetailsProps = {
  ingredient: TIngredient;
};

export const IngredientDetails = ({
  ingredient,
}: TIngredientDetailsProps): React.JSX.Element => {
  return (
    <div className={styles.root}>
      <img className={styles.image} src={ingredient.image_large} alt={ingredient.name} />
      <p className="text text_type_main-medium mt-4 mb-8">{ingredient.name}</p>
      <ul className={`${styles.nutrients} mb-5`}>
        <li className={styles.nutrient}>
          <p className="text text_type_main-default text_color_inactive">Калории,ккал</p>
          <span
            className={`${styles.value} text text_type_digits-default text_color_inactive mt-2`}
          >
            {ingredient.calories}
          </span>
        </li>
        <li className={styles.nutrient}>
          <p className="text text_type_main-default text_color_inactive">Белки, г</p>
          <span
            className={`${styles.value} text text_type_digits-default text_color_inactive mt-2`}
          >
            {ingredient.proteins}
          </span>
        </li>
        <li className={styles.nutrient}>
          <p className="text text_type_main-default text_color_inactive">Жиры, г</p>
          <span
            className={`${styles.value} text text_type_digits-default text_color_inactive mt-2`}
          >
            {ingredient.fat}
          </span>
        </li>
        <li className={styles.nutrient}>
          <p className="text text_type_main-default text_color_inactive">Углеводы, г</p>
          <span
            className={`${styles.value} text text_type_digits-default text_color_inactive mt-2`}
          >
            {ingredient.carbohydrates}
          </span>
        </li>
      </ul>
    </div>
  );
};

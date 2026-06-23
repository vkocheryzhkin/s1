import type { TIngredient } from '@utils/types';

import styles from './orders-ingredients-icons.module.css';

const MAX_VISIBLE = 6;

type TOrdersIngredientsIconsProps = {
  ingredients: TIngredient[];
};

export const OrdersIngredientsIcons = ({
  ingredients,
}: TOrdersIngredientsIconsProps): React.JSX.Element => {
  const visibleIngredients = ingredients.slice(0, MAX_VISIBLE);
  const hiddenCount = ingredients.length - MAX_VISIBLE;

  return (
    <ul className={styles.list}>
      {visibleIngredients.map((ingredient, index) => (
        <li
          key={ingredient._id}
          className={styles.item}
          style={{ zIndex: visibleIngredients.length - index }}
        >
          <span className={styles.border}>
            <img className={styles.image} src={ingredient.image} alt={ingredient.name} />
          </span>
        </li>
      ))}
      {hiddenCount > 0 && (
        <li className={`${styles.item} ${styles.more}`}>
          <span className={styles.border}>
            <span className={`${styles.count} text text_type_digits-default`}>
              +{hiddenCount}
            </span>
          </span>
        </li>
      )}
    </ul>
  );
};

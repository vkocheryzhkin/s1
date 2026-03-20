import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
  onOpenOrderDetails: () => void;
};

export const BurgerConstructor = ({
  ingredients,
  onOpenOrderDetails,
}: TBurgerConstructorProps): React.JSX.Element => {
  const bun = ingredients.find((ingredient) => ingredient.type === 'bun');
  const fillingIngredients = ingredients.filter(
    (ingredient) => ingredient.type !== 'bun'
  );
  const mockFillings = fillingIngredients.slice(0, 4);

  const totalCalories = mockFillings.reduce(
    (sum, ingredient) => sum + ingredient.calories,
    0
  );
  const orderCalories = bun ? totalCalories + bun.calories * 2 : totalCalories;

  return (
    <section className={`${styles.burger_constructor} pt-25`}>
      {bun && (
        <div className={`${styles.blocked_item} ml-8`}>
          <ConstructorElement
            type="top"
            isLocked={true}
            text={`${bun.name} (верх)`}
            price={bun.calories}
            thumbnail={bun.image}
          />
        </div>
      )}
      <ul className={`${styles.ingredients} custom-scroll`}>
        {mockFillings.map((ingredient) => (
          <li key={ingredient._id} className={styles.ingredient_row}>
            <DragIcon type="primary" />
            <ConstructorElement
              text={ingredient.name}
              price={ingredient.calories}
              thumbnail={ingredient.image}
            />
          </li>
        ))}
      </ul>
      {bun && (
        <div className={`${styles.blocked_item} ml-8`}>
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text={`${bun.name} (низ)`}
            price={bun.calories}
            thumbnail={bun.image}
          />
        </div>
      )}
      <div className={`${styles.total} mt-10`}>
        <div className={styles.total_price}>
          <span className="text text_type_digits-medium">{orderCalories}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button
          htmlType="button"
          type="primary"
          size="large"
          onClick={onOpenOrderDetails}
        >
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};

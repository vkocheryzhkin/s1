import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useDispatch, useSelector } from 'react-redux';

import { createOrder } from '@services/order-slice';

import type { AppDispatch, RootState } from '@services/store';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  onOpenOrderDetails: () => void;
};

export const BurgerConstructor = ({
  onOpenOrderDetails,
}: TBurgerConstructorProps): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const bun = useSelector((state: RootState) => state.burgerConstructor.bun);
  const fillingIngredients = useSelector(
    (state: RootState) => state.burgerConstructor.ingredients
  );

  const totalCalories = fillingIngredients.reduce(
    (sum, ingredient) => sum + ingredient.calories,
    0
  );
  const orderCalories = bun ? totalCalories + bun.calories * 2 : totalCalories;
  const orderIngredientIds = bun
    ? [bun._id, ...fillingIngredients.map((ingredient) => ingredient._id), bun._id]
    : [];

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
        {fillingIngredients.map((ingredient) => (
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
          onClick={() => {
            onOpenOrderDetails();
            void dispatch(createOrder({ ingredients: orderIngredientIds }));
          }}
          disabled={!bun}
        >
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};

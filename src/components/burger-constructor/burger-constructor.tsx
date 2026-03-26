import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';

import { addIngredient, removeIngredient } from '@services/constructor-slice';
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
  const [{ isOver }, dropRef] = useDrop(
    () => ({
      accept: 'ingredient',
      drop: (ingredient: RootState['ingredients']['items'][number]): void => {
        dispatch(addIngredient(ingredient));
      },
      collect: (monitor): { isOver: boolean } => ({
        isOver: monitor.isOver(),
      }),
    }),
    [dispatch]
  );

  return (
    <section
      ref={(node) => {
        dropRef(node);
      }}
      className={`${styles.burger_constructor} pt-25 ${isOver ? styles.drop_active : ''}`}
    >
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
      {!bun && (
        <div className={`${styles.blocked_item} ml-8`}>
          <div
            className={`${styles.placeholder} text text_type_main-default text_color_inactive`}
          >
            Перетащите булку (верх)
          </div>
        </div>
      )}
      <ul className={`${styles.ingredients} custom-scroll`}>
        {fillingIngredients.length === 0 && (
          <li
            className={`${styles.placeholder} text text_type_main-default text_color_inactive`}
          >
            Перетащите начинку
          </li>
        )}
        {fillingIngredients.map((ingredient) => (
          <li key={ingredient.uuid} className={styles.ingredient_row}>
            <DragIcon type="primary" />
            <ConstructorElement
              text={ingredient.name}
              price={ingredient.calories}
              thumbnail={ingredient.image}
              handleClose={() => {
                dispatch(removeIngredient(ingredient.uuid));
              }}
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
      {!bun && (
        <div className={`${styles.blocked_item} ml-8`}>
          <div
            className={`${styles.placeholder} text text_type_main-default text_color_inactive`}
          >
            Перетащите булку (низ)
          </div>
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

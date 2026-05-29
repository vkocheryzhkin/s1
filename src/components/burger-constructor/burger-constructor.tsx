import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';

import {
  addIngredient,
  moveIngredient,
  removeIngredient,
} from '@services/constructor-slice';
import { createOrder } from '@services/order-slice';
import { selectOrderPrice } from '@services/selectors';

import type { AppDispatch, RootState } from '@services/store';
import type { TConstructorIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  onOpenOrderDetails: () => void;
};
type TConstructorDragItem = {
  index: number;
  uuid: string;
};
type TConstructorItemProps = {
  ingredient: TConstructorIngredient;
  index: number;
  moveCard: (fromIndex: number, toIndex: number) => void;
  onRemove: (uuid: string) => void;
};

const ConstructorItem = ({
  ingredient,
  index,
  moveCard,
  onRemove,
}: TConstructorItemProps): React.JSX.Element => {
  const [, dropRef] = useDrop<TConstructorDragItem>(
    () => ({
      accept: 'constructor-ingredient',
      hover: (item): void => {
        if (item.index === index) {
          return;
        }

        moveCard(item.index, index);
        item.index = index;
      },
    }),
    [index, moveCard]
  );
  const [, dragRef] = useDrag(
    () => ({
      type: 'constructor-ingredient',
      item: { uuid: ingredient.uuid, index },
    }),
    [ingredient.uuid, index]
  );

  return (
    <li
      ref={(node) => {
        dragRef(dropRef(node));
      }}
      className={styles.ingredient_row}
    >
      <DragIcon type="primary" />
      <ConstructorElement
        text={ingredient.name}
        price={ingredient.calories}
        thumbnail={ingredient.image}
        handleClose={() => {
          onRemove(ingredient.uuid);
        }}
      />
    </li>
  );
};

export const BurgerConstructor = ({
  onOpenOrderDetails,
}: TBurgerConstructorProps): React.JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const bun = useSelector((state: RootState) => state.burgerConstructor.bun);
  const fillingIngredients = useSelector(
    (state: RootState) => state.burgerConstructor.ingredients
  );
  const orderPrice = useSelector(selectOrderPrice);
  const orderIngredientIds = bun
    ? [bun._id, ...fillingIngredients.map((ingredient) => ingredient._id), bun._id]
    : [];
  const handleMoveIngredient = (fromIndex: number, toIndex: number): void => {
    dispatch(moveIngredient({ fromIndex, toIndex }));
  };
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
        {fillingIngredients.map((ingredient, index) => (
          <ConstructorItem
            key={ingredient.uuid}
            ingredient={ingredient}
            index={index}
            moveCard={handleMoveIngredient}
            onRemove={(uuid) => {
              dispatch(removeIngredient(uuid));
            }}
          />
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
          <span className="text text_type_digits-medium">{orderPrice}</span>
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

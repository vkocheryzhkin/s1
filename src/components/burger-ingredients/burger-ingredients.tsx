import { Counter, CurrencyIcon, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useRef, useState } from 'react';

import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
  onIngredientClick: (ingredient: TIngredient) => void;
};

type TIngredientProps = {
  ingredient: TIngredient;
  onIngredientClick: (ingredient: TIngredient) => void;
};

const Ingredient = ({
  ingredient,
  onIngredientClick,
}: TIngredientProps): React.JSX.Element => (
  <li>
    <button
      type="button"
      className={styles.card}
      onClick={() => onIngredientClick(ingredient)}
    >
      <Counter count={1} size="default" />
      <img
        src={ingredient.image}
        alt={ingredient.name}
        className={`${styles.image} pl-4 pr-4`}
      />
      <div className={`${styles.price} mt-1 mb-1`}>
        <span className="text text_type_digits-default">{ingredient.calories}</span>
        <CurrencyIcon type="primary" />
      </div>
      <p className={`${styles.name} text text_type_main-default`}>{ingredient.name}</p>
    </button>
  </li>
);

export const BurgerIngredients = ({
  ingredients,
  onIngredientClick,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const [currentTab, setCurrentTab] = useState<'bun' | 'main' | 'sauce'>('bun');
  const bunSectionRef = useRef<HTMLHeadingElement>(null);
  const sauceSectionRef = useRef<HTMLHeadingElement>(null);
  const mainSectionRef = useRef<HTMLHeadingElement>(null);

  const scrollToSection = (tab: 'bun' | 'main' | 'sauce'): void => {
    setCurrentTab(tab);

    const sectionMap: Record<
      'bun' | 'main' | 'sauce',
      React.RefObject<HTMLHeadingElement | null>
    > = {
      bun: bunSectionRef,
      main: mainSectionRef,
      sauce: sauceSectionRef,
    };

    sectionMap[tab].current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  const buns = ingredients.filter((ingredient) => ingredient.type === 'bun');
  const sauces = ingredients.filter((ingredient) => ingredient.type === 'sauce');
  const fillings = ingredients.filter((ingredient) => ingredient.type === 'main');

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          <Tab
            value="bun"
            active={currentTab === 'bun'}
            onClick={() => {
              scrollToSection('bun');
            }}
          >
            Булки
          </Tab>
          <Tab
            value="main"
            active={currentTab === 'main'}
            onClick={() => {
              scrollToSection('main');
            }}
          >
            Начинки
          </Tab>
          <Tab
            value="sauce"
            active={currentTab === 'sauce'}
            onClick={() => {
              scrollToSection('sauce');
            }}
          >
            Соусы
          </Tab>
        </ul>
      </nav>
      <div className={`${styles.ingredients} custom-scroll mt-10 pr-2`}>
        <h3 className="text text_type_main-medium" ref={bunSectionRef}>
          Булки
        </h3>
        <ul className={`${styles.grid} mt-6`}>
          {buns.map((ingredient) => (
            <Ingredient
              key={ingredient._id}
              ingredient={ingredient}
              onIngredientClick={onIngredientClick}
            />
          ))}
        </ul>
        <h3 className="text text_type_main-medium mt-10" ref={sauceSectionRef}>
          Соусы
        </h3>
        <ul className={`${styles.grid} mt-6`}>
          {sauces.map((ingredient) => (
            <Ingredient
              key={ingredient._id}
              ingredient={ingredient}
              onIngredientClick={onIngredientClick}
            />
          ))}
        </ul>
        <h3 className="text text_type_main-medium mt-10" ref={mainSectionRef}>
          Начинки
        </h3>
        <ul className={`${styles.grid} mt-6`}>
          {fillings.map((ingredient) => (
            <Ingredient
              key={ingredient._id}
              ingredient={ingredient}
              onIngredientClick={onIngredientClick}
            />
          ))}
        </ul>
      </div>
    </section>
  );
};

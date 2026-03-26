import { Counter, CurrencyIcon, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { setSelectedIngredient } from '@services/selected-ingredient-slice';

import type { AppDispatch, RootState } from '@services/store';
import type { TIngredient } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TIngredientProps = {
  ingredient: TIngredient;
  onIngredientClick: () => void;
};

const Ingredient = ({
  ingredient,
  onIngredientClick,
}: TIngredientProps): React.JSX.Element => (
  <li>
    <button type="button" className={styles.card} onClick={onIngredientClick}>
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

export const BurgerIngredients = (): React.JSX.Element => {
  type TBurgerTab = 'bun' | 'main' | 'sauce';
  const dispatch = useDispatch<AppDispatch>();
  const ingredients = useSelector((state: RootState) => state.ingredients.items);
  const [currentTab, setCurrentTab] = useState<TBurgerTab>('bun');
  const bunSectionRef = useRef<HTMLHeadingElement>(null);
  const sauceSectionRef = useRef<HTMLHeadingElement>(null);
  const mainSectionRef = useRef<HTMLHeadingElement>(null);
  const ingredientsContainerRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (tab: TBurgerTab): void => {
    const sectionMap: Record<TBurgerTab, React.RefObject<HTMLHeadingElement | null>> = {
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

  useEffect(() => {
    const container = ingredientsContainerRef.current;
    if (!container) return;

    const getClosestTabToContainerTopLeft = (): TBurgerTab => {
      const containerRect = container.getBoundingClientRect();

      const sectionCandidates: {
        tab: TBurgerTab;
        el: HTMLHeadingElement | null;
      }[] = [
        { tab: 'bun', el: bunSectionRef.current },
        { tab: 'sauce', el: sauceSectionRef.current },
        { tab: 'main', el: mainSectionRef.current },
      ];

      let bestTab: TBurgerTab = 'bun';
      let bestDistance = Number.POSITIVE_INFINITY;

      for (const { tab, el } of sectionCandidates) {
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        const dx = rect.left - containerRect.left;
        const dy = rect.top - containerRect.top;
        const distance = dx * dx + dy * dy; // Squared Euclidean distance

        if (distance < bestDistance) {
          bestDistance = distance;
          bestTab = tab;
        }
      }

      return bestTab;
    };

    let rafId: number | null = null;
    const onScroll = (): void => {
      if (rafId !== null) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        const nextTab = getClosestTabToContainerTopLeft();
        setCurrentTab((prev) => (prev === nextTab ? prev : nextTab));
      });
    };

    // Initial sync (before user starts interacting).
    onScroll();
    container.addEventListener('scroll', onScroll, { passive: true });

    return (): void => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      container.removeEventListener('scroll', onScroll);
    };
  }, []);

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
      <div
        className={`${styles.ingredients} custom-scroll mt-10 pr-2`}
        ref={ingredientsContainerRef}
      >
        <h3 className="text text_type_main-medium" ref={bunSectionRef}>
          Булки
        </h3>
        <ul className={`${styles.grid} mt-6`}>
          {buns.map((ingredient) => (
            <Ingredient
              key={ingredient._id}
              ingredient={ingredient}
              onIngredientClick={() => dispatch(setSelectedIngredient(ingredient))}
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
              onIngredientClick={() => dispatch(setSelectedIngredient(ingredient))}
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
              onIngredientClick={() => dispatch(setSelectedIngredient(ingredient))}
            />
          ))}
        </ul>
      </div>
    </section>
  );
};

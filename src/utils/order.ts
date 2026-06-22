import type { TIngredient, TOrder, TOrderStatus } from './types';

const ORDER_STATUSES: TOrderStatus[] = ['created', 'pending', 'done'];

export const ORDER_STATUS_TEXT: Record<TOrderStatus, string> = {
  created: 'Создан',
  pending: 'Готовится',
  done: 'Выполнен',
};

export const isValidOrder = (
  order: TOrder,
  ingredientsMap: Map<string, TIngredient>
): boolean => {
  if (
    typeof order.number !== 'number' ||
    !order.createdAt ||
    !Array.isArray(order.ingredients) ||
    order.ingredients.length === 0 ||
    !ORDER_STATUSES.includes(order.status)
  ) {
    return false;
  }

  return order.ingredients.every((id) => ingredientsMap.has(id));
};

export const getOrderPrice = (
  order: TOrder,
  ingredientsMap: Map<string, TIngredient>
): number =>
  order.ingredients.reduce((sum, id) => sum + (ingredientsMap.get(id)?.price ?? 0), 0);

export type TOrderIngredientItem = {
  ingredient: TIngredient;
  count: number;
};

export const getOrderIngredients = (
  order: TOrder,
  ingredientsMap: Map<string, TIngredient>
): TOrderIngredientItem[] => {
  const counts = new Map<string, number>();

  for (const id of order.ingredients) {
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }

  return [...counts.entries()]
    .map(([id, count]) => {
      const ingredient = ingredientsMap.get(id);
      return ingredient ? { ingredient, count } : null;
    })
    .filter((item): item is TOrderIngredientItem => item !== null);
};

export const getUniqueOrderIngredients = (
  order: TOrder,
  ingredientsMap: Map<string, TIngredient>
): TIngredient[] => {
  const uniqueIds = [...new Set(order.ingredients)];

  return uniqueIds
    .map((id) => ingredientsMap.get(id))
    .filter((ingredient): ingredient is TIngredient => Boolean(ingredient));
};

export const splitOrderNumbers = (numbers: number[]): number[][] => {
  const columns: number[][] = [];

  for (let index = 0; index < numbers.length && columns.length < 2; index += 10) {
    columns.push(numbers.slice(index, index + 10));
  }

  return columns;
};

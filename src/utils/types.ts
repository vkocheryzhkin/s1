export type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type TConstructorIngredient = TIngredient & {
  uuid: string;
};

export type TIngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

export type TCreateOrderRequest = {
  ingredients: string[];
};

export type TCreateOrderResponse = {
  success: boolean;
  name: string;
  order: {
    number: number;
  };
};

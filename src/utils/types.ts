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

export type TUser = {
  email: string;
  name: string;
};

export type TAuthResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: TUser;
};

export type TTokenResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

export type TUserResponse = {
  success: boolean;
  user: TUser;
};

export type TRegisterRequest = {
  email: string;
  password: string;
  name: string;
};

export type TLoginRequest = {
  email: string;
  password: string;
};

export type TUpdateUserRequest = {
  name: string;
  email: string;
  password: string;
};

export type TMessageResponse = {
  success: boolean;
  message: string;
};

export type TPasswordResetRequest = {
  email: string;
};

export type TPasswordResetConfirmRequest = {
  password: string;
  token: string;
};

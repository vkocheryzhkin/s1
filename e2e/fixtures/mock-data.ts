export const API_URL = 'https://new-stellarburgers.education-services.ru/api';

export const MOCK_USER = {
  email: 'test@test.com',
  name: 'Test User',
};

export const MOCK_BUN = {
  _id: '643d69a5c3f7b9001b9e3d1a',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  __v: 0,
};

export const MOCK_FILLING = {
  _id: '643d69a5c3f7b9001b9e3d1b',
  name: 'Биокотлета из марсианской Магнolit',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  __v: 0,
};

export const MOCK_SAUCE = {
  _id: '643d69a5c3f7b9001b9e3d52',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  __v: 0,
};

export const MOCK_INGREDIENTS = [MOCK_BUN, MOCK_FILLING, MOCK_SAUCE];

export const ORDER_NUMBER = 12345;

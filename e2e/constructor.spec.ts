import { expect, test } from '@playwright/test';

import type { Page } from '@playwright/test';

const API_URL = 'https://new-stellarburgers.education-services.ru/api';

const mockUser = {
  email: 'test@test.com',
  name: 'Test User',
};

const mockIngredients = [
  {
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
  },
  {
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
  },
  {
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
  },
];

const ORDER_NUMBER = 12345;

const setupConstructorMocks = async (page: Page): Promise<void> => {
  await page.route(`${API_URL}/ingredients`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: mockIngredients }),
    });
  });

  await page.route(`${API_URL}/auth/user`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, user: mockUser }),
    });
  });

  await page.route(`${API_URL}/orders`, async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          name: 'Space флюorescent антарктический бургер',
          order: { number: ORDER_NUMBER },
        }),
      });
      return;
    }

    await route.continue();
  });
};

const authenticateUser = async (page: Page): Promise<void> => {
  await page.addInitScript(() => {
    localStorage.setItem('accessToken', 'Bearer test-access-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');
  });
};

test.describe('Constructor page', () => {
  test.beforeEach(async ({ page }) => {
    await authenticateUser(page);
    await setupConstructorMocks(page);
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Соберите бургер' })).toBeVisible();
  });

  test('builds a burger via drag and drop and creates an order', async ({ page }) => {
    const bun = page.getByRole('button', { name: 'Краторная булка N-200i' });
    const filling = page.getByRole('button', {
      name: 'Биокотлета из марсианской Магнolit',
    });
    const constructorDropZone = page.getByText('Перетащите булку (верх)');

    await bun.dragTo(constructorDropZone);
    await expect(page.getByText('Краторная булка N-200i (верх)')).toBeVisible();
    await expect(page.getByText('Краторная булка N-200i (низ)')).toBeVisible();

    await filling.dragTo(page.getByText('Перетащите начинку'));
    await expect(
      page.locator('span').filter({ hasText: /^Биокотлета из марсианской Магнolit$/ })
    ).toBeVisible();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByText(String(ORDER_NUMBER))).toBeVisible();
    await expect(page.getByText('идентификатор заказа')).toBeVisible();
    await expect(page.getByText('Ваш заказ начали готовить')).toBeVisible();
  });

  test('opens and closes ingredient details modal', async ({ page }) => {
    await page
      .getByRole('button', { name: 'Соус Spicy-X' })
      .click();

    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).toBeVisible();
    await expect(page.getByText('Соус Spicy-X').first()).toBeVisible();

    await page.locator('button').filter({ has: page.locator('svg') }).last().click();

    await expect(
      page.getByRole('heading', { name: 'Детали ингредиента' })
    ).not.toBeVisible();
  });

  test('closes order modal after successful order creation', async ({ page }) => {
    const bun = page.getByRole('button', { name: 'Краторная булка N-200i' });

    await bun.dragTo(page.getByText('Перетащите булку (верх)'));
    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByText(String(ORDER_NUMBER))).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(page.getByText('идентификатор заказа')).not.toBeVisible();
    await expect(page.getByRole('heading', { name: 'Соберите бургер' })).toBeVisible();
  });
});

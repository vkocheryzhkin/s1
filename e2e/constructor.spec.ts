import { test } from '@playwright/test';

import { ConstructorPage } from './pages/constructor.page';

test.describe('Constructor page', () => {
  test('user can build a burger, inspect ingredients and create an order', async ({
    page,
  }) => {
    const constructorPage = new ConstructorPage(page);

    await constructorPage.setupMocks();
    await constructorPage.open();

    await constructorPage.openIngredientDetails();
    await constructorPage.expectIngredientDetailsVisible();
    await constructorPage.closeModal();
    await constructorPage.expectIngredientModalHidden();

    await constructorPage.dragBunToConstructor();
    await constructorPage.dragFillingToConstructor();

    await constructorPage.submitOrder();
    await constructorPage.expectOrderModalVisible();
    await constructorPage.closeModal();
    await constructorPage.expectOrderModalHidden();
  });
});

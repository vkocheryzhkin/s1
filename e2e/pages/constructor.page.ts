import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect } from '@playwright/test';

import {
  API_URL,
  MOCK_BUN,
  MOCK_FILLING,
  MOCK_SAUCE,
  ORDER_NUMBER,
} from '../fixtures/mock-data';

import type { Locator, Page } from '@playwright/test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONSTRUCTOR_HAR = path.join(__dirname, '../fixtures/constructor.har');

export class ConstructorPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly bunDropZone: Locator;
  readonly fillingDropZone: Locator;
  readonly bunCard: Locator;
  readonly fillingCard: Locator;
  readonly sauceCard: Locator;
  readonly submitOrderButton: Locator;
  readonly ingredientModalHeading: Locator;
  readonly modalCloseButton: Locator;
  readonly constructorFillingItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Соберите бургер' });
    this.bunDropZone = page.getByText('Перетащите булку (верх)');
    this.fillingDropZone = page.getByText('Перетащите начинку');
    this.bunCard = page.getByRole('button', { name: MOCK_BUN.name });
    this.fillingCard = page.getByRole('button', { name: MOCK_FILLING.name });
    this.sauceCard = page.getByRole('button', { name: MOCK_SAUCE.name });
    this.submitOrderButton = page.getByRole('button', { name: 'Оформить заказ' });
    this.ingredientModalHeading = page.getByRole('heading', {
      name: 'Детали ингредиента',
    });
    this.modalCloseButton = page.locator('[class*="modal_"] [class*="close"]');
    this.constructorFillingItem = page
      .locator('span')
      .filter({ hasText: new RegExp(`^${MOCK_FILLING.name}$`) });
  }

  async setupMocks(): Promise<void> {
    await this.page.addInitScript(() => {
      localStorage.setItem('accessToken', 'Bearer test-access-token');
      localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await this.page.routeFromHAR(CONSTRUCTOR_HAR, {
      url: `${API_URL}/**`,
      update: false,
    });
  }

  async open(): Promise<void> {
    await this.page.goto('/');
    await expect(this.heading).toBeVisible();
  }

  async openIngredientDetails(): Promise<void> {
    await this.sauceCard.click();
    await expect(this.ingredientModalHeading).toBeVisible();
  }

  async expectIngredientDetailsVisible(): Promise<void> {
    const modal = this.page.locator('[class*="modal_"]');

    await expect(modal.getByText(MOCK_SAUCE.name)).toBeVisible();
    await expect(modal.getByRole('img', { name: MOCK_SAUCE.name })).toBeVisible();
    await expect(modal.getByText('Калории,ккал')).toBeVisible();
    await expect(modal.getByText('Белки, г')).toBeVisible();
    await expect(modal.getByText('Жиры, г')).toBeVisible();
    await expect(modal.getByText('Углеводы, г')).toBeVisible();
  }

  async closeModal(): Promise<void> {
    await this.modalCloseButton.click();
  }

  async expectIngredientModalHidden(): Promise<void> {
    await expect(this.ingredientModalHeading).not.toBeVisible();
  }

  async dragBunToConstructor(): Promise<void> {
    await this.bunCard.dragTo(this.bunDropZone);
    await expect(this.page.getByText(`${MOCK_BUN.name} (верх)`)).toBeVisible();
    await expect(this.page.getByText(`${MOCK_BUN.name} (низ)`)).toBeVisible();
  }

  async dragFillingToConstructor(): Promise<void> {
    await this.fillingCard.dragTo(this.fillingDropZone);
    await expect(this.constructorFillingItem).toBeVisible();
  }

  async submitOrder(): Promise<void> {
    await this.submitOrderButton.click();
  }

  async expectOrderModalVisible(): Promise<void> {
    await expect(this.page.getByText(String(ORDER_NUMBER))).toBeVisible();
    await expect(this.page.getByText('идентификатор заказа')).toBeVisible();
    await expect(this.page.getByText('Ваш заказ начали готовить')).toBeVisible();
  }

  async expectOrderModalHidden(): Promise<void> {
    await expect(this.page.getByText('идентификатор заказа')).not.toBeVisible();
    await expect(this.heading).toBeVisible();
  }
}

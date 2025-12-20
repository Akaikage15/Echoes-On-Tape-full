import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should have correct title', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await expect(page).toHaveTitle(/Echoes On Tape/);
  });

  test('should display hero section', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    // Проверяем наличие главной кнопки
    const ctaButton = page.getByRole('link', { name: /Слушать сейчас/i }).first();
    await expect(ctaButton).toBeVisible();
  });

  test('should navigate to releases', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    // Кликаем по ссылке Релизы в навигации
    await page.getByRole('link', { name: 'Релизы' }).first().click();
    
    // Проверяем URL
    await expect(page).toHaveURL(/.*releases/);
    
    // Проверяем заголовок страницы
    await expect(page.getByRole('heading', { name: /Каталог релизов/i })).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

test.describe('ChatBot Functionality', () => {

  test.beforeEach(async ({ page }) => {
    // Mock common endpoints to avoid network errors
    await page.route('**/api/customer/context', async route => {
      await route.fulfill({ json: { cartDto: { products: [] } } });
    });
    await page.route('**/api/homepage-grids', async route => {
      await route.fulfill({ json: [] });
    });
    await page.route('**/api/categories', async route => {
      await route.fulfill({ json: [] });
    });
  });

  test('ChatBot replaces Cookie Banner and functions correctly', async ({ page }) => {
    await page.goto('/');

    // 1. Check Cookie Banner is visible initially
    const cookieBannerText = page.getByText('Vaše súkromie je pre nás dôležité');
    await expect(cookieBannerText).toBeVisible();

    // 2. Dismiss Cookie Banner (Reject)
    await page.getByRole('button', { name: 'Odmietnuť' }).click();

    // 3. Verify Cookie Banner is gone
    await expect(cookieBannerText).not.toBeVisible();

    // 4. Verify Robot Icon is present
    // The icon is in ChatBot.jsx. It has a specific SVG or button.
    // The button has className "fixed bottom-4 left-4 ..."
    // Let's use the role or a specific selector.
    // Since there is no text in the closed button (just SVG), we can use a locator with aria-label.
    const robotIcon = page.getByLabel('Chatbot');
    await expect(robotIcon).toBeVisible();

    // 5. Open ChatBot
    await robotIcon.click();

    // 6. Verify Chat Window is visible
    const chatWindow = page.getByText('Ahoj, som Tany');
    await expect(chatWindow).toBeVisible();

    // 7. Verify Options
    const cookieOption = page.getByRole('button', { name: 'Nastavenie cookies' });
    const orderOption = page.getByRole('button', { name: 'Stav objednávky' });

    await expect(cookieOption).toBeVisible();
    await expect(orderOption).toBeVisible();

    // 8. Test "Nastavenie cookies"
    await cookieOption.click();

    // Cookie Banner should reappear
    await expect(cookieBannerText).toBeVisible();

    // Close banner again
    await page.getByRole('button', { name: 'Odmietnuť' }).click();

    // Re-open chat
    await robotIcon.click();

    // 9. Test "Stav objednávky"
    await orderOption.click();
    await expect(page).toHaveURL(/.*\/account\/orders/);
  });
});

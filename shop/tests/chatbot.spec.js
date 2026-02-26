import { test, expect } from '@playwright/test';

test.describe('ChatBot Functionality', () => {

  test.beforeEach(async ({ page }) => {
    // Mock common endpoints to avoid network errors
    await page.route('**/api/homepage-grids', async route => {
      await route.fulfill({ json: { homepageGrids: [] } });
    });

    await page.route('**/api/categories', async route => {
      await route.fulfill({ json: [] });
    });

    await page.route('**/api/products*', async route => {
      await route.fulfill({ json: { content: [], totalPages: 0 } });
    });

    await page.route('**/api/customer/context*', async route => {
      await route.fulfill({ json: { cartDto: {} } });
    });

     await page.route('**/api/blogs', async route => {
        await route.fulfill({ json: [] });
    });

    // Mock Chat API endpoints
    await page.route('**/api/chat/assistant', async route => {
        const body = JSON.parse(route.request().postData());
        await route.fulfill({
            json: { message: `Stav objednávky pre: ${body.message}` }
        });
    });

    await page.route('**/api/chat/message', async route => {
        const body = JSON.parse(route.request().postData());
        // Verify payload structure
        if (body.message && body.email) {
             await route.fulfill({
                json: { message: `Ďakujeme za správu: ${body.message} od ${body.email}` }
            });
        } else {
            await route.fulfill({ status: 400, json: { message: 'Missing fields' } });
        }
    });
  });

  test('ChatBot menu navigation and interactions', async ({ page }) => {
    await page.goto('/');

    // 0. Dismiss Cookie Banner if present
    const cookieBanner = page.getByText('Používame súbory cookie');
    if (await cookieBanner.isVisible()) {
        await page.getByRole('button', { name: 'Odmietnuť' }).click();
    }

    // 1. Open ChatBot
    const chatButton = page.getByLabel('Chatbot');
    await expect(chatButton).toBeVisible();
    await chatButton.click();

    // Verify Menu
    await expect(page.getByText('Ahoj, som Tany')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Nastavenie cookies' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Stav objednávky' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Kontaktovať podporu' })).toBeVisible();

    // 2. Test Order Status Flow
    await page.getByRole('button', { name: 'Stav objednávky' }).click();

    // Verify Chat View
    await expect(page.getByText('Prosím zadajte identifikátor objednávky')).toBeVisible();
    const input = page.getByPlaceholder('Číslo objednávky...');
    await expect(input).toBeVisible();

    // Send Message
    await input.fill('OBJ-123');
    await page.getByLabel('Odoslať').click();

    // Verify Response
    await expect(page.getByText('Stav objednávky pre: OBJ-123')).toBeVisible();

    // Back to Menu
    await page.getByLabel('Späť').click();
    await expect(page.getByRole('button', { name: 'Stav objednávky' })).toBeVisible();

    // 3. Test Contact Support Flow (Two Steps)
    await page.getByRole('button', { name: 'Kontaktovať podporu' }).click();

    // Verify Initial Chat View
    await expect(page.getByText('Ahoj, ako ti môžeme pomôcť?')).toBeVisible();
    const messageInput = page.getByPlaceholder('Napíšte správu...');
    await expect(messageInput).toBeVisible();

    // Step 1: Send Message
    await messageInput.fill('Mám problém s produktom');
    await page.getByLabel('Odoslať').click();

    // Verify Bot asks for Email
    await expect(page.getByText('Ďakujeme. Prosím, zadajte váš email')).toBeVisible();
    const emailInput = page.getByPlaceholder('Váš email...');
    await expect(emailInput).toBeVisible();

    // Step 2: Send Email
    await emailInput.fill('zakaznik@example.com');
    await page.getByLabel('Odoslať').click();

    // Verify Final Response
    await expect(page.getByText('Ďakujeme za správu: Mám problém s produktom od zakaznik@example.com')).toBeVisible();

    // Back to Menu
    await page.getByLabel('Späť').click();
    await expect(page.getByRole('button', { name: 'Kontaktovať podporu' })).toBeVisible();

    // 4. Test Cookie Settings (opens banner)
    await page.getByRole('button', { name: 'Nastavenie cookies' }).click();
    await expect(page.getByText('Ahoj, som Tany')).not.toBeVisible(); // Chat should close
    await expect(page.getByText('Vaše súkromie je pre nás dôležité')).toBeVisible(); // Banner visible
  });
});

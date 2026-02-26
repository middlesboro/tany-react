import { test, expect } from '@playwright/test';

test.describe('Shop Full Flow Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Block external widget scripts to ensure our mocks are used
    await page.route('**widget.packeta.com**', route => route.abort());
    await page.route('**balikomat.sps-sro.sk**', route => route.abort());

    // Mock Packeta and SPS widgets to avoid external dependency issues and allow testing selection
    await page.addInitScript(() => {
        window.Packeta = {
            Widget: {
                pick: (apiKey, callback, options) => {
                    console.log('Mock Packeta pick called');
                    // Simulate selecting a point immediately
                    callback({
                        id: '9999',
                        name: 'Test Point',
                        city: 'Bratislava',
                        street: 'Test Street 1'
                    });
                }
            }
        };
        window.SPSwidget = {
            config: {},
            showMap: () => {
                console.log('Mock SPS showMap called');
                if (window.handleSPSPickupPoint) {
                    window.handleSPSPickupPoint({
                        id: 'SPS-9999',
                        description: 'Test SPS Point',
                        address: 'Test Street 2',
                        city: 'Kosice',
                        zip: '04001',
                        countryISO: 'SK',
                        type: 'ALM'
                    });
                }
            }
        };
    });

    await page.goto('/');
    // Handle cookie consent if present
    const cookieButton = page.getByRole('button', { name: 'Prijať všetko' });
    if (await cookieButton.isVisible()) {
      await cookieButton.click();
    }
  });

  test('Homepage loads and displays key elements', async ({ page }) => {
    await expect(page).toHaveTitle(/Tany.sk/);

    // Verify slider is visible (checking for image inside picture element which is characteristic of the slider)
    await expect(page.locator('picture img').first()).toBeVisible();

    // Verify at least one product grid is visible
    // We use .first() on the locator, not on the expect result
    const productGrid = page.locator('.grid.grid-cols-2').first();

    // Wait for the grid to appear (async fetch) - strict check
    await expect(productGrid).toBeVisible({ timeout: 10000 });

    // Verify at least one product card is present
    const firstProduct = productGrid.locator('.group').first();
    await expect(firstProduct).toBeVisible();

    // Verify navigation to "Doprava"
    await page.getByRole('link', { name: 'Doprava' }).first().click();

    // Check if page loaded - strict check
    const dopravaHeading = page.getByRole('heading', { name: 'Doprava' });
    await expect(dopravaHeading).toBeVisible();
  });

  test('Search functionality works with dynamic product', async ({ page }) => {
    // 1. Get a product title from the homepage
    // We expect the homepage to have products. If not, the test should fail as per requirements.
    const firstProductCard = page.locator('.grid.grid-cols-2 .group').first();
    await expect(firstProductCard).toBeVisible({ timeout: 10000 });

    const productTitleElement = firstProductCard.locator('h3').first();
    const productTitle = await productTitleElement.innerText();
    console.log(`Searching for product: ${productTitle}`);

    // 2. Type into search bar
    const searchInput = page.getByPlaceholder('Hľadať v obchode...');
    await searchInput.fill(productTitle.substring(0, 4));

    // 3. Wait for results - strict check
    // We expect results because we searched for a product that exists on the homepage
    const resultsDropdown = page.locator('.absolute.z-50 ul');
    await expect(resultsDropdown).toBeVisible({ timeout: 5000 });

    // 4. Click first result
    const firstResult = resultsDropdown.locator('li button').first();
    // Capture the text of the result we are about to click to verify later
    const resultText = await firstResult.locator('.font-medium').innerText();
    await firstResult.click();

    // 5. Verify navigation to product detail
    await expect(page).toHaveURL(/.*\/produkt\/.*/);
    // The product detail H1 should contain the text from the search result
    await expect(page.getByRole('heading', { level: 1 })).toContainText(resultText);
  });

  test('Complete Checkout Flow (COD/Bank Wire)', async ({ page }) => {
    // 1. Add product to cart
    // Strict check: Homepage must have products
    const firstProductCard = page.locator('.grid.grid-cols-2 .group').first();
    await expect(firstProductCard).toBeVisible({ timeout: 10000 });

    // Click on the product image/link to go to detail
    await firstProductCard.locator('a').first().click();

    // Wait for product detail page
    await expect(page.getByRole('button', { name: 'Do košíka' })).toBeVisible();

    // Click Add to Cart
    await page.getByRole('button', { name: 'Do košíka' }).click();

    // 2. Go to Cart
    await page.goto('/cart');
    await expect(page.getByRole('heading', { name: 'Nákupný košík' })).toBeVisible();

    // Verify item is in cart (checking for any item row)
    await expect(page.locator('.cart-item, .flex.items-center.gap-4')).first().toBeVisible();

    // 3. Proceed to Checkout
    await page.getByRole('link', { name: 'Pokračovať v objednávke' }).click();
    await expect(page).toHaveURL(/.*\/order/);

    // 4. Fill Guest Details
    await page.fill('input[name="firstname"]', 'Janko');
    await page.fill('input[name="lastname"]', 'Hraško');
    await page.fill('input[name="email"]', 'janko.hrasko@example.com');
    await page.fill('input[name="phone"]', '+421944123456');

    await page.fill('input[name="street"]', 'Hlavná 1');
    await page.fill('input[name="city"]', 'Bratislava');
    await page.fill('input[name="zip"]', '81101');

    // 5. Select Carrier
    // Strategy: Look for "Kuriér" first. If not found, pick first available.
    // Check if we need to handle widget.

    const courierOption = page.locator('label:has-text("Kuriér"), label:has-text("Doručenie na adresu")');
    if (await courierOption.count() > 0) {
        await courierOption.first().click();
    } else {
        // Fallback: Click the first available carrier label
        const firstCarrier = page.locator('input[name="carrier"]').first();
        const firstCarrierLabel = page.locator(`label:has(input[name="carrier"][value="${await firstCarrier.getAttribute('value')}"])`);
        await firstCarrierLabel.click();

        // Check if widget button appeared
        const widgetButton = page.locator('button:has-text("Vybrať výdajné miesto")');
        if (await widgetButton.isVisible()) {
             // Mock widget selection via click (intercepted by beforeEach mocks)
             console.log('Widget carrier selected, triggering mock via click...');
             await widgetButton.click();
        }
    }

    // 6. Select Payment (COD or Bank Wire)
    const codOption = page.locator('label:has-text("Dobierka"), label:has-text("Platba pri prevzatí")');
    const bankWireOption = page.locator('label:has-text("Prevod"), label:has-text("Bankový prevod")');

    if (await codOption.count() > 0) {
        await codOption.first().click();
    } else if (await bankWireOption.count() > 0) {
        await bankWireOption.first().click();
    } else {
         // Fallback to first payment method if specific ones not found (risky if it's card payment)
         await page.locator('input[name="payment"]').first().click();
    }

    // 7. Submit Order
    const submitButton = page.getByRole('button', { name: 'Objednať s povinnosťou platby' });
    await expect(submitButton).toBeEnabled();
    await submitButton.click();

    // 8. Verify Confirmation
    await expect(page).toHaveURL(/.*\/order\/confirmation\/.*/, { timeout: 10000 });
    await expect(page.getByText('Ďakujeme za vašu objednávku')).toBeVisible();
  });
});

import { test, expect } from '@playwright/test';

test('Verify ChatBot links', async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:3000');

    // Wait for the chatbot button to be visible and click it
    const chatButton = page.locator('button[aria-label="Chatbot"]');
    await expect(chatButton).toBeVisible();
    await chatButton.click();

    // Select "Stav objednávky" to trigger a bot message flow
    const statusOption = page.locator('button:has-text("Stav objednávky")');
    await expect(statusOption).toBeVisible();
    await statusOption.click();

    // Type a message that would trigger a response, or simulate the response.
    // Since we don't have a real backend, the bot might respond with "Prepáčte, nerozumel som."
    // But we want to test if a LINK in the response is rendered as a link.
    // The easiest way is to mock the `sendAssistantMessage` response or inject a message.

    // However, since we cannot easily mock the module import inside the browser context without interception,
    // let's try to simulate a user message with a link and see if it is linkified in the chat bubble.
    // The `ChatBot` renders user messages too. And `linkify` is applied to ALL messages.

    const input = page.locator('input[placeholder="Číslo objednávky..."]');
    await expect(input).toBeVisible();
    await input.fill('Check https://google.com');
    await page.keyboard.press('Enter');

    // Wait for the message to appear
    const messageBubble = page.locator('div', { hasText: 'Check https://google.com' }).last();
    await expect(messageBubble).toBeVisible();

    // Check if there is an anchor tag inside
    const link = messageBubble.locator('a');
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', 'https://google.com');
    await expect(link).toHaveAttribute('target', '_blank');

    // Take a screenshot
    await page.screenshot({ path: 'verification_chatbot_link.png' });
});

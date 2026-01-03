
import pytest
from playwright.sync_api import sync_playwright, expect

def verify_invoice_screenshot():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Set mock auth token
        page.add_init_script("localStorage.setItem('auth_token', 'mock_token')")

        # Mock GET /api/admin/orders/1
        page.route("**/api/admin/orders/1", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body='{"id": 1, "cartId": "123", "customerId": "cust1", "items": [], "deliveryAddress": {}, "invoiceAddress": {}}'
        ))

        # Mock GET /api/admin/orders/1/invoice - we don't need to mock download for screenshot, just presence of button
        page.route("**/api/admin/orders/1/invoice", lambda route: route.fulfill(
            status=200,
            content_type="application/pdf",
            body=b'%PDF-1.4\n...'
        ))

        page.goto("http://localhost:3000/admin/orders/1")

        # Expect the button to be visible
        button = page.get_by_role("button", name="Download Invoice")
        expect(button).to_be_visible()

        # Take screenshot
        page.screenshot(path="verification_invoice.png")

        browser.close()

if __name__ == "__main__":
    verify_invoice_screenshot()

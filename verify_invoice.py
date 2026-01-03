
import pytest
from playwright.sync_api import sync_playwright

def verify_invoice_button():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Set mock auth token
        page.add_init_script("localStorage.setItem('auth_token', 'mock_token')")

        # Mock GET /api/admin/orders/1 to return a sample order
        page.route("**/api/admin/orders/1", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body='{"id": 1, "cartId": "123", "customerId": "cust1"}'
        ))

        # Mock GET /api/admin/orders/1/invoice
        page.route("**/api/admin/orders/1/invoice", lambda route: route.fulfill(
            status=200,
            content_type="application/pdf",
            body=b'%PDF-1.4\n...'
        ))

        # Navigate to the order edit page
        # Note: We are testing against the local dev server
        page.goto("http://localhost:3000/admin/orders/1")

        # Wait for the button to appear
        try:
            button = page.wait_for_selector("button:has-text('Download Invoice')", timeout=5000)
            if button.is_visible():
                print("SUCCESS: 'Download Invoice' button is visible.")
            else:
                print("FAILURE: 'Download Invoice' button found but not visible.")
        except Exception as e:
            print(f"FAILURE: 'Download Invoice' button not found. Error: {e}")
            page.screenshot(path="verify_invoice_failure.png")

        browser.close()

if __name__ == "__main__":
    verify_invoice_button()

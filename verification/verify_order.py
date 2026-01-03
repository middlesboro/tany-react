from playwright.sync_api import sync_playwright

def verify_order_edit():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Mock the API responses
        page.route("**/api/admin/orders/123", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body='''
            {
                "id": "123",
                "cartId": "cart-1",
                "customerId": "cust-1",
                "finalPrice": 150.50,
                "carrierId": "carrier-1",
                "paymentId": "payment-1",
                "deliveryAddress": {
                    "street": "Main St 1",
                    "city": "Test City",
                    "zip": "12345"
                },
                "invoiceAddress": {
                    "street": "Billing St 2",
                    "city": "Bill Town",
                    "zip": "54321"
                },
                "deliveryAddressSameAsInvoiceAddress": false,
                "items": [
                    {
                        "id": "item-1",
                        "name": "Test Product 1",
                        "quantity": 2,
                        "price": 50.00,
                        "image": "https://via.placeholder.com/150"
                    },
                    {
                        "id": "item-2",
                        "name": "Test Product 2",
                        "quantity": 1,
                        "price": 50.50,
                        "image": "https://via.placeholder.com/150"
                    }
                ]
            }
            '''
        ))

        # We need to log in first (or just bypass auth if possible, but the app checks auth)
        # Actually, since we are mocking, we can just access the page if we mock the auth check?
        # The app checks localStorage 'auth_token'. We can set it.

        page.goto("http://localhost:3000/admin/login")
        page.evaluate("localStorage.setItem('auth_token', 'mock-token')")

        # Navigate to Order Edit page
        page.goto("http://localhost:3000/admin/orders/123")

        # Wait for the form to load
        page.wait_for_selector("form")

        # Take a screenshot
        page.screenshot(path="verification/order_edit_verification.png", full_page=True)

        browser.close()

if __name__ == "__main__":
    verify_order_edit()

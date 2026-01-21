import time
from playwright.sync_api import sync_playwright

def test_price_breakdown_images():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Mock API response for getOrder
        order_id = "123"

        mock_order = {
            "id": int(order_id),
            "firstname": "John",
            "lastname": "Doe",
            "email": "john@example.com",
            "phone": "1234567890",
            "status": "NEW",
            "finalPrice": 120.00,
            "items": [
                {
                    "id": 1,
                    "name": "Test Product 1",
                    "quantity": 1,
                    "price": 100.00,
                    "image": "https://via.placeholder.com/150"
                }
            ],
            "priceBreakDown": {
                "items": [
                    {
                        "type": "PRODUCT",
                        "name": "Test Product 1",
                        "quantity": 1,
                        "priceWithVat": 100.00,
                        "image": "https://via.placeholder.com/150"
                    },
                     {
                        "type": "PAYMENT",
                        "name": "Credit Card",
                        "quantity": 1,
                        "priceWithVat": 10.00
                    },
                     {
                        "type": "CARRIER",
                        "name": "DHL",
                        "quantity": 1,
                        "priceWithVat": 10.00
                    }
                ],
                "totalPrice": 120.00,
                "totalPriceWithoutVat": 100.00,
                "totalPriceVatValue": 20.00
            },
            "deliveryAddress": {
                "street": "Main St 1",
                "city": "City",
                "zip": "12345"
            },
            "invoiceAddress": {
                "street": "Main St 1",
                "city": "City",
                "zip": "12345"
            }
        }

        # Intercept API calls
        # Note: The proxy in package.json might complicate things if the browser requests localhost:3000/api/...
        # But Playwright intercepts network requests from the browser.

        page.route("**/api/orders/123", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body=str(mock_order).replace("'", '"').replace("False", "false").replace("True", "true")
        ))

        # Payment info mock (optional but good to avoid errors)
        page.route("**/api/orders/123/payment-info", lambda route: route.fulfill(
            status=404, # Let's say payment info not found or irrelevant
            body="{}"
        ))

        # Navigate to Order Confirmation page
        # We need to wait for the server to be up.

        max_retries = 30
        for i in range(max_retries):
            try:
                page.goto(f"http://localhost:3000/order/confirmation/{order_id}")
                break
            except Exception as e:
                print(f"Waiting for server... {e}")
                time.sleep(2)

        # Wait for the Price Breakdown to appear
        try:
            page.wait_for_selector("text=Súhrn ceny", timeout=10000)
            page.wait_for_selector("text=Test Product 1", timeout=5000)
        except Exception as e:
            print("Timeout waiting for selectors")
            page.screenshot(path="verification/error_screenshot.png")
            raise e

        # Check if image is present in the Price Breakdown section
        # The Price Breakdown is in the section with "Súhrn ceny"

        # We can look for the image with alt="Test Product 1" specifically in the breakdown container.
        # But first let's just take a screenshot.

        time.sleep(1) # Ensure render
        page.screenshot(path="verification/verification.png")
        print("Screenshot taken.")

        browser.close()

if __name__ == "__main__":
    test_price_breakdown_images()

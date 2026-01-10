
from playwright.sync_api import sync_playwright, expect

def test_checkout_pickup_point(page):
    # Mock the API responses
    # 1. Mock context with cart containing saved pickup point
    page.route("**/api/customer/context", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body="""
        {
            "cartDto": {
                "cartId": "test-cart-id",
                "carriers": [
                    { "id": 1, "name": "Packeta", "type": "PACKETA", "selected": true, "price": 2.50 },
                    { "id": 2, "name": "Courier", "type": "COURIER", "price": 5.00 }
                ],
                "payments": [
                    { "id": 1, "name": "Card", "selected": true, "price": 0.00 }
                ],
                "selectedCarrierId": 1,
                "selectedPaymentId": 1,
                "selectedPickupPointId": "packeta-point-123",
                "totalProductPrice": 100.00
            },
            "customerDto": null
        }
        """
    ))

    # 2. Mock PUT /cart to verify what gets sent back
    # We will inspect the request in the route handler
    def handle_put_cart(route):
        request = route.request
        data = request.post_data_json
        print(f"PUT /cart payload: {data}")
        # Verify selectedPickupPointId is NOT null
        if data.get('selectedPickupPointId') == 'packeta-point-123':
            print("VERIFICATION SUCCESS: selectedPickupPointId preserved in auto-save.")
        else:
            print(f"VERIFICATION FAILURE: selectedPickupPointId is {data.get('selectedPickupPointId')}")

        route.fulfill(status=200, body="{}")

    page.route("**/api/cart", handle_put_cart)

    # 3. Navigate to Checkout
    # Note: We need to bypass login redirection if any.
    # Assuming public route /order is accessible or we are 'guest'.
    page.goto("http://localhost:3000/order")

    # 4. Wait for page load and check for the pickup point text
    # The text should be "Selected Point: ... Uložené výdajné miesto ... or packeta-point-123"
    # We look for "Selected Point:" and verify content.

    locator = page.locator("text=Selected Point:")
    expect(locator).to_be_visible(timeout=10000)

    # Check what is rendered
    text_content = locator.text_content()
    print(f"Rendered text: {text_content}")

    # It should contain the ID or the placeholder name
    if "Uložené výdajné miesto" in text_content or "packeta-point-123" in text_content:
         print("UI VERIFICATION SUCCESS: Pickup point is displayed.")
    else:
         print("UI VERIFICATION FAILURE: Pickup point not displayed correctly.")

    page.screenshot(path="verification/checkout_pickup_verified.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_checkout_pickup_point(page)
        except Exception as e:
            print(f"Test failed: {e}")
            page.screenshot(path="verification/checkout_failure.png")
        finally:
            browser.close()

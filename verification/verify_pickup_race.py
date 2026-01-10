
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
    def handle_put_cart(route):
        request = route.request
        data = request.post_data_json
        print(f"PUT /cart payload: {data}")

        # We expect selectedPickupPointId to be PRESERVED (i.e., not null)
        # because we initialized it from the cart.
        if data.get('selectedPickupPointId') == 'packeta-point-123':
            print("VERIFICATION SUCCESS: selectedPickupPointId preserved in auto-save.")
        else:
            print(f"VERIFICATION FAILURE: selectedPickupPointId is {data.get('selectedPickupPointId')}")

        route.fulfill(status=200, body="{}")

    page.route("**/api/cart", handle_put_cart)

    # 3. Navigate to Checkout
    page.goto("http://localhost:3000/order")

    # 4. Wait a bit to ensure effects run
    page.wait_for_timeout(3000)

    # 5. Check UI
    locator = page.locator("text=Selected Point:")
    expect(locator).to_be_visible(timeout=5000)
    text_content = locator.text_content()
    print(f"Rendered text: {text_content}")

    if "Uložené výdajné miesto" in text_content or "packeta-point-123" in text_content:
         print("UI VERIFICATION SUCCESS: Pickup point is displayed.")
    else:
         print("UI VERIFICATION FAILURE: Pickup point not displayed correctly.")

    page.screenshot(path="verification/checkout_race_check.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_checkout_pickup_point(page)
        except Exception as e:
            print(f"Test failed: {e}")
        finally:
            browser.close()


from playwright.sync_api import sync_playwright, expect
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Define mock cart response
    cart_response = {
        "cartId": "cart123",
        "items": [
            {
                "productId": "p1",
                "id": "item1",
                "title": "Test Product",
                "price": 20.0,
                "quantity": 2,
                "image": "https://via.placeholder.com/150"
            }
        ],
        "priceBreakDown": {
            "items": [
                {
                    "type": "PRODUCT",
                    "priceWithVat": 20.0,
                    "quantity": 2,
                    "name": "Test Product",
                    "id": "item1"
                },
                {
                    "type": "CARRIER",
                    "priceWithVat": 5.0,
                    "quantity": 1,
                    "name": "Shipping"
                },
                {
                    "type": "DISCOUNT",
                    "priceWithVat": -2.0,
                    "quantity": 1,
                    "name": "Promo Code"
                }
            ],
            "totalPrice": 43.0,
            "totalPriceWithoutVat": 35.83,
            "totalPriceVatValue": 7.17
        },
        "finalPrice": 43.0,
        "totalProductPrice": 40.0
    }

    # Route requests to mock the cart API response
    def handle_context_route(route):
        response = {
            "cartDto": cart_response,
            "customerDto": None
        }
        route.fulfill(status=200, content_type="application/json", body=str(response).replace("'", '"').replace('None', 'null'))

    # Intercept the customer context call which loads the cart
    page.route("**/api/customer/context*", handle_context_route)

    # Also intercept categories to avoid errors
    page.route("**/api/categories", lambda route: route.fulfill(json=[{"id": 1, "title": "Test Category", "slug": "test-cat", "children": []}]))

    # Navigate to Cart page
    try:
        page.goto("http://localhost:3000/cart")
    except Exception as e:
        print(f"Error navigating: {e}")

    # Wait for the summary to appear
    try:
        page.wait_for_selector("text=Summary", timeout=10000)
    except:
        page.screenshot(path="verification/debug_fail_context.png")
        print("Failed to load cart summary")
        browser.close()
        return

    time.sleep(2) # Allow React to render

    # Take screenshot of Cart page
    page.screenshot(path="verification/cart_breakdown.png")

    # Verify content
    content = page.content()
    # Check for elements from PriceBreakdown
    found = True
    if "Tovar (2 ks)" not in content:
        print("Missing Tovar line")
        found = False
    if "Shipping" not in content:
        print("Missing Shipping line")
        found = False
    if "Promo Code" not in content:
        print("Missing Promo Code line")
        found = False
    if "43.00 €" not in content:
        print("Missing Total Price")
        found = False

    if found:
        print("SUCCESS: All breakdown elements found.")
    else:
        print("FAILURE: Some elements missing.")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

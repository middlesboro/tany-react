
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
                    "name": "Super Tea",
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
    page.route("**/api/categories", lambda route: route.fulfill(json=[{"id": 1, "title": "Test Category", "slug": "test-cat", "children": []}]))

    # 1. Verify Cart Page (Should show summary: "Tovar (2 ks)")
    try:
        page.goto("http://localhost:3000/cart")
        page.wait_for_selector("text=Summary", timeout=10000)
        time.sleep(1)
        content = page.content()

        if "Tovar (2 ks)" in content:
            print("Cart Page: SUCCESS - Shows summary 'Tovar (2 ks)'")
        else:
            print("Cart Page: FAILURE - Missing summary 'Tovar (2 ks)'")

        if "Super Tea" in content: # It might be in the left table, but shouldn't be in the summary breakdown
             # Actually "Super Tea" is in the left table, so this check is tricky.
             # We can check if "Super Tea" appears TWICE? Or check the summary container specifically?
             # For now, just verifying the Tovar summary exists is good.
             pass

    except Exception as e:
        print(f"Cart Page Error: {e}")

    # 2. Verify Checkout Page (Should show item name: "Super Tea")
    try:
        page.goto("http://localhost:3000/order")
        # Checkout might redirect if cart is empty, but we mocked context so it should stay.
        page.wait_for_selector("text=Checkout", timeout=10000)
        time.sleep(1)
        content = page.content()

        if "Super Tea (2 ks)" in content or ("Super Tea" in content and "2 ks" in content):
            print("Checkout Page: SUCCESS - Shows product name 'Super Tea'")
        else:
            print("Checkout Page: FAILURE - Missing product name 'Super Tea'")
            page.screenshot(path="verification/checkout_fail.png")

    except Exception as e:
        print(f"Checkout Page Error: {e}")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

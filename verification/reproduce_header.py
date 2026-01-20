
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    page.goto("http://localhost:3000/cart")

    # Mock Customer Context with OLD structure (has totalProductPrice)
    page.route("**/api/customer/context", lambda route: route.fulfill(
         status=200,
        content_type="application/json",
        body='{"cartDto": {"cartId": "cart1", "products": [{"id": "p1", "productId": "p1", "productName": "Product", "price": 100, "quantity": 1}], "totalProductPrice": 100.00, "discounts": []}, "customerDto": null}'
    ))

    # Mock Add Discount with NEW structure (has finalPrice, NO totalProductPrice)
    # Based on user's JSON provided earlier
    user_json = '''{
    "cartId": "cart1",
    "items": [
        {
            "productId": "p1",
            "quantity": 1,
            "title": "Product",
            "price": 100
        }
    ],
    "appliedDiscounts": [
        {
            "code": "zlava10",
            "value": 10
        }
    ],
    "totalPrice": 100.0,
    "totalDiscount": 10.0,
    "finalPrice": 90.0,
    "freeShipping": false
}'''

    page.route("**/api/cart/*/discount?code=TEST10", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body=user_json
    ))

    # Reload to get initial state
    page.reload()
    page.wait_for_selector('text=100.00 €') # Header check (assuming it matches formatting)
    page.screenshot(path="verification/repro_header_1.png")

    # Apply Discount
    page.fill('input[placeholder="Enter code"]', "TEST10")
    page.click('button:has-text("Apply")')

    # Wait for update.
    # If bug exists, header might show 0.00 € or NaN or stay 100 if it doesn't update (but user says 0)
    # The cart page BODY should show 90.00 (from my previous fix).
    # The HEADER should show 90.00 if fixed, or something else if broken.

    page.wait_for_timeout(1000)
    page.screenshot(path="verification/repro_header_2_after_discount.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

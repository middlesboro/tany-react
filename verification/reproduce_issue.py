
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Log in mock (just bypassing auth checks if any, or assuming public access to cart)
    page.goto("http://localhost:3000/cart")

    # Mock Customer Context with OLD structure
    page.route("**/api/customer/context", lambda route: route.fulfill(
         status=200,
        content_type="application/json",
        body='{"cartDto": {"cartId": "cart1", "products": [{"id": "p1", "productId": "p1", "productName": "Old Structure Product", "price": 100, "quantity": 1, "images": []}], "totalProductPrice": 100, "discounts": []}, "customerDto": null}'
    ))

    # Mock Add Discount with NEW structure (User provided JSON)
    user_json = '''{
    "cartId": "69664d80a16be90a53450f56",
    "customerId": "6953cd059b527233d452c7fa",
    "items": [
        {
            "productId": "6965213acf461663af84d499",
            "quantity": 2,
            "title": "New Structure Product",
            "image": "https://via.placeholder.com/150",
            "price": 9.5
        }
    ],
    "appliedDiscounts": [
        {
            "code": "zlava10",
            "title": "Zlava 10%",
            "discountType": "PERCENTAGE",
            "value": 10,
            "freeShipping": false
        }
    ],
    "totalPrice": 58.335772,
    "totalDiscount": 3.21,
    "finalPrice": 55.125772,
    "freeShipping": false
}'''

    page.route("**/api/cart/*/discount?code=TEST10", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body=user_json
    ))

    # Reload to get initial state
    page.reload()
    page.wait_for_selector('text=Old Structure Product')
    page.screenshot(path="verification/repro_1_initial.png")

    # Apply Discount
    page.fill('input[placeholder="Enter code"]', "TEST10")
    page.click('button:has-text("Apply")')

    # Wait a bit for update
    page.wait_for_timeout(1000)

    # Take screenshot of the broken state
    page.screenshot(path="verification/repro_2_broken.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

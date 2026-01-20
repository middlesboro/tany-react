
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Log in as admin
    page.goto("http://localhost:3000/admin/login")

    # Mock login success if backend is down
    page.route("**/api/auth/login", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='{"token": "fake-jwt-token"}'
    ))

    # Mock user details
    page.evaluate("localStorage.setItem('auth_token', 'fake-jwt-token')")

    # Navigate to Cart Discounts - directly
    # Mock the list response
    page.route("**/api/admin/cart-discounts?**", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='{"content": [{"id": "1", "title": "Test Discount", "code": "TEST10", "discountType": "PERCENTAGE", "value": 10, "active": true, "dateFrom": null, "dateTo": null, "freeShipping": false}], "totalPages": 1}'
    ))

    page.goto("http://localhost:3000/admin/cart-discounts")
    page.screenshot(path="verification/cart_discounts_list.png")

    # Go to Create page
    page.goto("http://localhost:3000/admin/cart-discounts/new")
    page.fill('input[name="title"]', "New Discount")
    page.fill('input[name="code"]', "NEW20")
    page.screenshot(path="verification/cart_discount_create.png")

    # Go to cart page (Public)
    # Mocking customer context
    page.route("**/api/customer/context", lambda route: route.fulfill(
         status=200,
        content_type="application/json",
        body='{"cartDto": {"cartId": "cart1", "products": [{"id": 1, "title": "Test Product", "price": 100, "quantity": 1}], "totalProductPrice": 100, "discounts": []}, "customerDto": null}'
    ))

    # Mock add discount
    page.route("**/api/cart/cart1/discount?code=TEST10", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='{"cartId": "cart1", "products": [{"id": 1, "title": "Test Product", "price": 100, "quantity": 1}], "totalProductPrice": 90, "discounts": [{"code": "TEST10", "value": 10}]}'
    ))

    page.goto("http://localhost:3000/cart")
    page.wait_for_selector('input[placeholder="Enter code"]')
    page.screenshot(path="verification/cart_page.png")

    # Simulate typing discount code
    page.fill('input[placeholder="Enter code"]', "TEST10")
    page.click('button:has-text("Apply")')

    # Wait for the discount to appear in the list (mocked response)
    page.wait_for_selector('text=TEST10')
    page.screenshot(path="verification/cart_page_applied.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

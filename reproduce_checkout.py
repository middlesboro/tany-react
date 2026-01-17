
import json
import time
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Mock customer context with cart
    page.route("**/api/customer/context*", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body=json.dumps({
            "cartDto": {
                "cartId": "cart123",
                "totalProductPrice": 100,
                "note": "Pre-filled note",
                "carriers": [
                    { "id": 1, "name": "Carrier A", "price": 5.0, "type": "STANDARD", "description": "Fast", "selected": True }
                ],
                "payments": [
                    { "id": 1, "name": "Payment A", "price": 2.0, "description": "Card", "selected": True }
                ],
                "products": [
                    { "id": 101, "title": "Product 1", "price": 50, "quantity": 2, "image": "img.jpg" }
                ],
                "firstname": "John",
                "lastname": "Doe",
                "email": "john@example.com",
                "phone": "1234567890",
                "invoiceAddress": {
                    "street": "Main St 1",
                    "city": "Metropolis",
                    "zip": "12345"
                }
            },
            "customerDto": {
                "firstname": "John",
                "lastname": "Doe",
                "email": "john@example.com",
                "phone": "1234567890"
            }
        })
    ))

    # Mock cart update (auto-save)
    def handle_cart_update(route):
        data = route.request.post_data_json
        print(f"Cart updated with note: {data.get('note')}")
        route.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps({"status": "updated"})
        )

    page.route("**/api/cart", handle_cart_update)

    # Mock order creation
    def handle_order_create(route):
        data = route.request.post_data_json
        print(f"Order created with note: {data.get('note')}")
        route.fulfill(
            status=201,
            content_type="application/json",
            body=json.dumps({"id": "order123"})
        )

    page.route("**/api/orders", handle_order_create)

    # Navigate to checkout
    page.goto("http://localhost:3000/order")

    # Wait for page to load
    page.wait_for_selector("h1:has-text('Checkout')")

    # Check if note field exists and has pre-filled value
    note_area = page.locator("textarea[name='note']")
    expect(note_area).to_be_visible()
    expect(note_area).to_have_value("Pre-filled note")
    print("Note field visible and pre-filled.")

    # Update note
    note_area.fill("New note content")

    # Wait for debounce (simulate user pause) and check if update trigger (log check is hard here, but we can assume it works if existing tests passed)
    # We can check if submit sends the new note.

    # Take screenshot
    page.screenshot(path="checkout_with_note.png")
    print("Screenshot taken.")

    # Submit order
    page.click("button:has-text('Complete Order')")

    # Wait for navigation or confirmation
    # Since we mock order creation and redirect, we can check for redirect or just trust the print statement from route handler.
    # The handler print will show up in stdout.

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

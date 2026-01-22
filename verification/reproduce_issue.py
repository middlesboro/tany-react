
import json
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Mock Data
    cart_mock = {
        "cartDto": {
            "cartId": "test-cart-id",
            "items": [
                 {
                    "id": 101,
                    "title": "Test Product",
                    "price": 10.0,
                    "quantity": 1,
                    "image": "test.jpg"
                 }
            ],
            "totalProductPrice": 10.0,
            "finalPrice": 15.0,
            "priceBreakDown": {
                "items": [
                     {"type": "PRODUCT", "title": "Test Product", "price": 10.0, "quantity": 1},
                     {"type": "CARRIER", "title": "Shipping", "price": 5.0}
                ],
                "totalPrice": 15.0,
                "totalPriceWithoutVat": 12.5,
                "totalPriceVatValue": 2.5
            },
            "carriers": [
                 {"id": 1, "name": "Test Carrier", "price": 5.0, "type": "STANDARD", "selected": True}
            ],
            "payments": [
                 {"id": 1, "name": "Test Payment", "price": 0.0, "selected": True}
            ],
            "firstname": "John",
            "lastname": "Doe",
            "email": "john@example.com",
            "phone": "+421944123456",
            "invoiceAddress": {
                "street": "Test Street 1",
                "city": "Test City",
                "zip": "12345"
            },
            "deliveryAddress": {},
            "note": "Initial Note"
        },
        "customerDto": {
             "firstname": "John",
            "lastname": "Doe",
            "email": "john@example.com",
            "phone": "+421944123456"
        }
    }

    # Mock API routes
    # Mock Categories and Blogs to prevent loading issues
    page.route("**/api/categories", lambda route: route.fulfill(json=[]))
    page.route("**/api/blogs", lambda route: route.fulfill(json=[]))
    page.route("**/api/products/search**", lambda route: route.fulfill(json=[]))

    # Mock Customer Context
    def handle_context(route):
        print(f"Handling context request: {route.request.url}")
        route.fulfill(json=cart_mock)

    page.route("**/api/customer/context**", handle_context)

    # Intercept PUT /api/cart
    put_requests = []
    def handle_put_cart(route):
        try:
            data = route.request.post_data_json
            put_requests.append(data)
            print(f"Captured PUT request with data: {data}")
            # Return updated cart (mocking backend response)
            # We just return the same cart but maybe updated
            cart_mock["cartDto"]["note"] = data.get("note", "")
            route.fulfill(json=cart_mock["cartDto"])
        except Exception as e:
            print(f"Error in handle_put_cart: {e}")
            route.continue_()

    page.route("**/api/cart", lambda route: handle_put_cart(route) if route.request.method == "PUT" else route.continue_())

    # Navigate to Checkout
    print("Navigating to /order...")
    try:
        page.goto("http://localhost:3000/order", timeout=60000)
    except Exception as e:
        print(f"Navigation failed: {e}")

    # Wait for page to load
    try:
        page.wait_for_selector("h1:has-text('Objednávka')", timeout=30000)
    except Exception:
        print("Timeout waiting for 'Objednávka' header. Dumping html.")
        page.screenshot(path="verification/failed_load.png")
        raise

    # Check if "Initial Note" is displayed
    # This verifies that if the backend returns the note, the frontend displays it.
    note_locator = page.locator("textarea[name='note']")
    expect(note_locator).to_have_value("Initial Note")
    print("Initial note verified (Initialization works).")

    # Change the note
    new_note = "Updated Note for API"
    note_locator.fill(new_note)

    # Wait for debounce (1s)
    print("Waiting for debounce...")
    page.wait_for_timeout(3000)

    # Check if PUT request was sent with new note AND description
    found_note = False
    found_description = False
    for req in put_requests:
        if req.get("note") == new_note:
            found_note = True
        if req.get("description") == new_note:
            found_description = True
        if found_note and found_description:
            break

    if found_note and found_description:
        print("SUCCESS: Note AND Description were sent to API.")
    else:
        print("FAILURE: Note or Description were NOT sent to API.")
        print(f"Found Note: {found_note}, Found Description: {found_description}")
        print("Requests captured:", put_requests)

    # Take screenshot
    page.screenshot(path="verification/checkout_note_final.png")

    browser.close()

if __name__ == "__main__":
    with sync_playwright() as playwright:
        run(playwright)

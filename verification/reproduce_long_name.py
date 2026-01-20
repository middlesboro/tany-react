
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={"width": 1000, "height": 800}) # Restrict viewport width to simulate issue
    page = context.new_page()

    page.goto("http://localhost:3000/cart")

    # Mock Customer Context with Long Name Product
    user_json = '''{
    "cartId": "69664d80a16be90a53450f56",
    "customerId": "6953cd059b527233d452c7fa",
    "items": [
        {
            "productId": "6965213acf461663af84d499",
            "quantity": 2,
            "title": "100% Indická Henna 200g (MEDENÁ kúra) - Indian Natural Hair Care - Extra Long Name To Force Overflow In The Table Cell If Not Handled Correctly",
            "image": "https://via.placeholder.com/150",
            "price": 9.5
        }
    ],
    "appliedDiscounts": [],
    "totalPrice": 19.0,
    "finalPrice": 19.0,
    "freeShipping": false
}'''

    page.route("**/api/customer/context", lambda route: route.fulfill(
         status=200,
        content_type="application/json",
        body=f'{{"cartDto": {user_json}, "customerDto": null}}'
    ))

    # Reload to get initial state
    page.reload()
    page.wait_for_selector('text=100% Indická Henna')

    page.screenshot(path="verification/repro_long_name.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

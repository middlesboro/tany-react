from playwright.sync_api import sync_playwright

def verify_account_feature():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Console logging
        page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))

        # Network logging
        page.on("request", lambda request: print(f"Request: {request.method} {request.url}"))
        page.on("response", lambda response: print(f"Response: {response.status} {response.url}"))

        # Mock APIs
        # 1. Mock Categories (needed for PublicLayout)
        page.route("**/api/categories", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body='[{"id": "1", "title": "Tea", "slug": "tea"}]'
        ))

        # 2. Mock Customer Context (logged in state)
        page.route("**/api/customer/context*", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body='''{
                "cartDto": {"cartId": "cart123", "totalProductPrice": 10.0},
                "customerDto": {
                    "id": "cust123",
                    "firstname": "John",
                    "lastname": "Doe",
                    "email": "john.doe@example.com",
                    "invoiceAddress": {"street": "Main St", "city": "City", "zip": "12345"},
                    "deliveryAddress": {"street": "Main St", "city": "City", "zip": "12345"}
                }
            }'''
        ))

        # 3. Mock Get Customer (for Account page)
        page.route("**/api/customer", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body='''{
                "id": "cust123",
                "firstname": "John",
                "lastname": "Doe",
                "email": "john.doe@example.com",
                "invoiceAddress": {"street": "Main St", "city": "City", "zip": "12345"},
                "deliveryAddress": {"street": "Main St", "city": "City", "zip": "12345"}
            }'''
        ))

        # Navigate to home
        print("Navigating to home...")
        page.goto("http://localhost:3000")

        # Wait for the context fetch to potentially complete
        page.wait_for_timeout(2000)

        # Check if email is displayed in header
        print("Checking header for email...")
        try:
            email_link = page.get_by_text("john.doe@example.com")
            email_link.wait_for(state="visible", timeout=5000)
            print("Email link found.")
        except Exception as e:
            print(f"Email link NOT found. Error: {e}")
            page.screenshot(path="verification/failed_header_debug.png")
            browser.close()
            return

        # Click email to go to account page
        print("Clicking email link...")
        email_link.click()

        # Check if Account page is loaded
        print("Checking Account page...")
        try:
            page.wait_for_url("**/account")
            heading = page.get_by_role("heading", name="Môj účet")
            heading.wait_for(state="visible", timeout=5000)
            print("Account page loaded.")
        except Exception as e:
            print(f"Account page NOT loaded. Error: {e}")
            page.screenshot(path="verification/failed_account_load_debug.png")
            browser.close()
            return

        # Verify form values
        firstname_input = page.locator("input[name='firstname']")
        # wait for value to be populated
        page.wait_for_timeout(1000)
        if firstname_input.input_value() == "John":
             print("Firstname loaded correctly.")
        else:
             print(f"Firstname mismatch: {firstname_input.input_value()}")

        # Take screenshot of Account page
        page.screenshot(path="verification/account_page.png")
        print("Screenshot saved to verification/account_page.png")

        browser.close()

if __name__ == "__main__":
    verify_account_feature()

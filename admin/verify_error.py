from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Mock the category creation endpoint to return 400
        page.route("**/api/admin/categories", lambda route: route.fulfill(
            status=400,
            content_type="application/json",
            body='{"message": "Test Error: Category cannot be created"}'
        ))

        # Mock getting categories to avoid errors on load
        page.route("**/api/admin/categories?*", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body='{"content": []}'
        ))

        # Mock getting filter parameters
        page.route("**/api/admin/filter-parameters?*", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body='{"content": []}'
        ))

        # Mock Login
        page.goto("http://localhost:3000/admin/login")
        page.evaluate("localStorage.setItem('auth_token', 'fake-token')")

        print("Navigating to Create Category page...")
        page.goto("http://localhost:3000/admin/categories/new")

        # Wait for form to load
        try:
            page.wait_for_selector('input[name="title"]', timeout=5000)
            print("Form loaded.")
        except:
            print("Form did not load.")
            page.screenshot(path="verification_failed_load.png")
            if "/login" in page.url:
                print("Redirected to login page.")
            return

        # Fill form
        page.fill('input[name="title"]', "Test Category")
        print("Form filled.")

        # Click Save
        # Find button with type submit
        page.click('button[type="submit"]')
        print("Submit clicked.")

        # Wait for error alert
        try:
            error_alert = page.wait_for_selector('div[role="alert"]', timeout=5000)
            text = error_alert.inner_text()
            print(f"Error alert found with text: {text}")

            if "Test Error: Category cannot be created" in text:
                print("Verification SUCCESS: Error message matches.")
                page.screenshot(path="verification_error_success.png")
            else:
                print("Verification FAILURE: Error message does not match.")
                page.screenshot(path="verification_error_mismatch.png")

        except Exception as e:
            print(f"Error finding alert: {e}")
            page.screenshot(path="verification_error_failed.png")

        finally:
            browser.close()

if __name__ == "__main__":
    run()

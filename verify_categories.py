from playwright.sync_api import sync_playwright

def verify_categories():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Mock the categories API
        page.route("**/api/categories", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body='[{"title": "Test Category 1", "slug": "test-category-1"}, {"title": "Test Category 2", "slug": "test-category-2"}]'
        ))

        # Mock other APIs to prevent errors
        page.route("**/api/customer/context", lambda route: route.fulfill(status=200, body='{}', content_type="application/json"))
        page.route("**/api/products*", lambda route: route.fulfill(status=200, body='{"content": [], "totalPages": 0}', content_type="application/json"))

        try:
            print("Navigating to home page...")
            page.goto("http://localhost:3000")

            print("Waiting for sidebar...")
            page.wait_for_selector("aside")

            print("Checking for static 'Všetky produkty' category...")
            page.wait_for_selector("text=Všetky produkty")

            print("Checking for dynamic 'Test Category 1'...")
            page.wait_for_selector("text=Test Category 1")

            print("Checking for dynamic 'Test Category 2'...")
            page.wait_for_selector("text=Test Category 2")

            print("Verification successful: Categories are loaded dynamically.")

        except Exception as e:
            print(f"Verification failed: {e}")
            page.screenshot(path="verification_failure.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    verify_categories()

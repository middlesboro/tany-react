from playwright.sync_api import sync_playwright

def verify_category_products():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Mock the categories API
        page.route("**/api/categories", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body='[{"id": "cat-1", "title": "Test Category 1", "slug": "test-category-1"}, {"id": "cat-2", "title": "Test Category 2", "slug": "test-category-2"}]'
        ))

        # Mock the category products API
        page.route("**/api/products/category/cat-1*", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body='''{
                "content": [
                    {"id": "prod-1", "title": "Category Product 1", "price": 10.0, "images": []},
                    {"id": "prod-2", "title": "Category Product 2", "price": 20.0, "images": []}
                ],
                "totalPages": 1
            }'''
        ))

        # Mock other APIs to prevent errors
        page.route("**/api/customer/context", lambda route: route.fulfill(status=200, body='{}', content_type="application/json"))
        # Mock home products to avoid errors if navigating via home (though we go direct here)
        page.route("**/api/products*", lambda route: route.fulfill(status=200, body='{"content": [], "totalPages": 0}', content_type="application/json"))


        try:
            print("Navigating to category page via slug...")
            page.goto("http://localhost:3000/category/test-category-1")

            print("Waiting for category title...")
            page.wait_for_selector("text=Test Category 1")

            print("Checking for 'Category Product 1'...")
            page.wait_for_selector("text=Category Product 1")

            print("Checking for 'Category Product 2'...")
            page.wait_for_selector("text=Category Product 2")

            # Take a screenshot for visual verification
            page.screenshot(path="verification/category_page_verification.png")
            print("Verification successful: Category products page loaded correctly. Screenshot saved.")

        except Exception as e:
            print(f"Verification failed: {e}")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    verify_category_products()

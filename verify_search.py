from playwright.sync_api import sync_playwright

def test_search():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Mock the API response
        page.route("**/api/products/search?query=Tea**", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body='[{"id":"1", "title":"Green Tea", "price":10.50, "images":["https://via.placeholder.com/150"], "shortDescription": "Delicious tea", "slug": "green-tea"}]'
        ))

        # Mock categories for layout
        page.route("**/api/categories", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body='[]'
        ))

        # Mock cart for layout
        page.route("**/api/customer/context", lambda route: route.fulfill(
             status=200,
             content_type="application/json",
             body='{"cartId": "123", "products": []}'
        ))

        # Navigate to homepage
        # Assuming dev server is running on localhost:3000 (standard for React)
        # If not, I'll need to check package.json or start it.
        # Based on memory "Frontend verification is performed using temporary Python scripts... interact with the local development server (npm start)"
        page.goto("http://localhost:3000/")

        # Type into search
        page.fill("input[placeholder='Hľadať v obchode...']", "Tea")

        # Wait for results
        # The dropdown appears when results are fetched.
        page.wait_for_selector("text=Green Tea")

        # Verify result content
        assert page.is_visible("text=10.50 €")

        # Take screenshot
        page.screenshot(path="verification/search_results.png")
        print("Screenshot saved to verification/search_results.png")

        browser.close()

if __name__ == "__main__":
    test_search()

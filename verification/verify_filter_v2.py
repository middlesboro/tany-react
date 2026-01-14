
from playwright.sync_api import sync_playwright

def verify_category_filter():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Mock API responses
        page.route('**/api/categories', lambda route: route.fulfill(
            status=200,
            content_type='application/json',
            body='[{ "id": "cat1", "title": "Test Category", "slug": "test-category", "children": [], "filterParameters": [{ "id": "p1", "name": "Color", "values": [{ "id": "v1", "name": "Red", "selected": false }, { "id": "v2", "name": "Blue", "selected": false }] }] }]'
        ))

        page.route('**/api/products/category/cat1*', lambda route: route.fulfill(
            status=200,
            content_type='application/json',
            body='{ "content": [{ "id": "prod1", "title": "Product 1", "price": 100 }], "totalPages": 1 }'
        ))

        page.route('**/api/categories/cat1/filter', lambda route: route.fulfill(
            status=200,
            content_type='application/json',
            body='[{ "id": "p1", "name": "Color", "values": [{ "id": "v1", "name": "Red", "selected": true }, { "id": "v2", "name": "Blue", "selected": false }] }]'
        ))

        try:
            # Go to home first to load the app shell
            page.goto('http://localhost:3000')

            # Now navigate to the category using client-side routing if possible,
            # or force load the URL.
            # If direct load fails, we can try to inject navigation.
            page.goto('http://localhost:3000/category/test-category')

            # Wait for content
            page.wait_for_selector('text=Test Category', timeout=10000)

            # Check for filter sidebar
            page.wait_for_selector('text=Filtre')
            page.wait_for_selector('text=Color')

            page.screenshot(path='verification/category_initial.png')

            # Click Red
            page.click('text=Red')

            # Wait for some update?
            # Since we mock the response, we might see the checkbox checked if we re-render based on response?
            # Or based on local state 'selectedFilters'.
            page.wait_for_timeout(1000)

            page.screenshot(path='verification/category_filtered.png')
            print('Verification successful')

        except Exception as e:
            print(f'Verification failed: {e}')
            # Take a screenshot of failure
            page.screenshot(path='verification/failure.png')
        finally:
            browser.close()

if __name__ == '__main__':
    verify_category_filter()


from playwright.sync_api import sync_playwright

def verify_category_filter():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Navigate to a category page (using a mock slug if backend is not available)
        # Since backend is down, this will likely show 'Loading' or 'Error'.
        # However, to verify UI layout, we might need to mock network responses.

        # Mock the API responses
        # 1. Categories
        page.route('**/api/categories', lambda route: route.fulfill(
            status=200,
            body='[{ id: cat1, title: Test Category, slug: test-category, children: [], filterParameters: [{ id: p1, name: Color, values: [{ id: v1, name: Red, selected: false }, { id: v2, name: Blue, selected: false }] }] }]'
        ))

        # 2. Products by Category
        page.route('**/api/products/category/cat1*', lambda route: route.fulfill(
            status=200,
            body='{ content: [{ id: prod1, title: Product 1, price: 100 }], totalPages: 1 }'
        ))

        # 3. Filter endpoint
        page.route('**/api/categories/cat1/filter', lambda route: route.fulfill(
            status=200,
            body='[{ id: p1, name: Color, values: [{ id: v1, name: Red, selected: true }, { id: v2, name: Blue, selected: false }] }]'
        ))

        try:
            page.goto('http://localhost:3000/category/test-category')

            # Wait for content to load
            page.wait_for_selector('text=Test Category')

            # Check for filter sidebar
            page.wait_for_selector('text=Filtre')
            page.wait_for_selector('text=Color')
            page.wait_for_selector('text=Red')

            # Take screenshot of initial state
            page.screenshot(path='verification/category_initial.png')

            # Click on 'Red' checkbox
            page.click('text=Red')

            # Wait for filter update (mocked response has Red selected)
            # Take screenshot after interaction
            page.screenshot(path='verification/category_filtered.png')

            print('Verification successful')
        except Exception as e:
            print(f'Verification failed: {e}')
        finally:
            browser.close()

if __name__ == '__main__':
    verify_category_filter()

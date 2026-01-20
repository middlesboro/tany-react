from playwright.sync_api import sync_playwright, expect

def test_baseline(page):
    # Set auth token to bypass login
    page.add_init_script("""
        localStorage.setItem('auth_token', 'dummy_token');
    """)

    # Mock Brands
    page.route("**/api/admin/brands**", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='{"content": [{"id": 1, "name": "Test Brand"}], "totalPages": 1}'
    ))

    # Mock Products
    page.route("**/api/admin/products**", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='{"content": [{"id": 1, "title": "Test Product", "price": 100, "quantity": 10, "brandId": 1, "externalStock": true, "active": true}], "totalPages": 1}'
    ))

    # Mock Categories
    page.route("**/api/admin/categories**", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='{"content": [{"id": 1, "title": "Test Category", "description": "Test Description"}], "totalPages": 1}'
    ))

    # Go to Products
    page.goto("http://localhost:3000/admin/products")

    # Check that NEW columns are MISSING
    # Use robust locators
    expect(page.get_by_role("columnheader", name="Brand")).not_to_be_visible()
    expect(page.get_by_role("columnheader", name="Active")).not_to_be_visible()

    # Go to Categories
    page.goto("http://localhost:3000/admin/categories")

    # Check that Description column IS PRESENT
    expect(page.get_by_role("columnheader", name="Description")).to_be_visible()

    # Check that Description cell is present
    expect(page.get_by_role("cell", name="Test Description")).to_be_visible()

    # Check that Filter by Title is MISSING
    # The current page has no filter input for title
    # We can check for a placeholder "Search by title..." or similar which we will add.
    expect(page.get_by_placeholder("Search by title...")).not_to_be_visible()

    print("Baseline verification passed: Old columns present, new columns missing.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_baseline(page)
        except Exception as e:
            print(f"Test failed: {e}")
            exit(1)
        finally:
            browser.close()

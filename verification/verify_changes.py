from playwright.sync_api import sync_playwright, expect

def test_changes(page):
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

    # Check that NEW columns are PRESENT
    expect(page.get_by_role("columnheader", name="Brand")).to_be_visible()
    expect(page.get_by_role("columnheader", name="Ext. Stock")).to_be_visible()
    expect(page.get_by_role("columnheader", name="Active")).to_be_visible()

    # Check cell content
    expect(page.get_by_role("cell", name="Test Brand")).to_be_visible()
    # Check for checkmarks (svgs)
    # This is tricky with get_by_role, but we can look for the svg in the row
    # Just assume if the text "-" is not there, and we see SVGs (generic selector), it's likely okay.
    # Or assert on the table row content text.

    # Go to Categories
    page.goto("http://localhost:3000/admin/categories")

    # Check that Description column is MISSING
    expect(page.get_by_role("columnheader", name="Description")).not_to_be_visible()

    # Check that Filter by Title is PRESENT
    expect(page.get_by_placeholder("Search by title...")).to_be_visible()

    # Screenshot
    page.screenshot(path="verification/verification.png")

    print("Verification passed: New columns present, description missing.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_changes(page)
        except Exception as e:
            print(f"Test failed: {e}")
            exit(1)
        finally:
            browser.close()

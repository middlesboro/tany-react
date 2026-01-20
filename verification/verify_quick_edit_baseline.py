from playwright.sync_api import sync_playwright, expect

def test_quick_edit_baseline(page):
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
        body='{"content": [{"id": 1, "title": "Test Product", "price": 100, "quantity": 10, "brandId": 1, "externalStock": false, "active": false}], "totalPages": 1}'
    ))

    # Go to Products
    page.goto("http://localhost:3000/admin/products")

    # Click Quick Edit
    page.get_by_role("button", name="Quick Edit").click()

    # Check for the Title input
    # It should be an input with value "Test Product"
    title_input = page.locator("input[name='title']")
    expect(title_input).to_have_value("Test Product")

    # Get the row containing this input
    row = title_input.locator("xpath=../..")

    # Check for checkboxes in this row
    # The baseline is that there are NO checkboxes (ExternalStock and Active are just text/icons)
    expect(row.locator("input[type='checkbox']")).not_to_be_visible()

    print("Baseline verification passed: No checkboxes in Quick Edit row.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_quick_edit_baseline(page)
        except Exception as e:
            print(f"Test failed: {e}")
            exit(1)
        finally:
            browser.close()

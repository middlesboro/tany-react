from playwright.sync_api import sync_playwright, expect

def test_quick_edit_update(page):
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

    # Mock PATCH Product
    def handle_patch(route):
        # We can inspect the payload here if we want, but for now just return the updated product
        # Assume the client sent updated values (e.g. active=true)
        # We return the object with active=true to simulate success
        route.fulfill(
            status=200,
            content_type="application/json",
            body='{"id": 1, "title": "Test Product", "price": 100, "quantity": 10, "brandId": 1, "externalStock": true, "active": true}'
        )

    page.route("**/api/admin/products/1", handle_patch)


    # Go to Products
    page.goto("http://localhost:3000/admin/products")

    # Click Quick Edit
    page.get_by_role("button", name="Quick Edit").click()

    # Check for the Title input
    title_input = page.locator("input[name='title']")
    expect(title_input).to_have_value("Test Product")

    # Get the row containing this input
    row = title_input.locator("xpath=../..")

    # Check for checkboxes in this row
    checkboxes = row.locator("input[type='checkbox']")
    expect(checkboxes).to_have_count(2) # ExternalStock and Active

    # Toggle them
    # First checkbox is External Stock (based on column order)
    ext_stock_checkbox = checkboxes.nth(0)
    active_checkbox = checkboxes.nth(1)

    ext_stock_checkbox.check()
    active_checkbox.check()

    # Click Save
    page.get_by_role("button", name="Save").click()

    # Verify that after save, the checkboxes are gone and we see the updated state (SVGs)
    # The row should return to read-only mode
    # And since we mocked the PATCH response to return true/true, we should see the green checkmarks.

    # Wait for the row to update (Quick Edit button should reappear)
    expect(page.get_by_role("button", name="Quick Edit")).to_be_visible()

    # Verify Ext Stock SVG
    # We can check that the svg is present in the cell where checkbox was
    # This is slightly hard to pinpoint without robust row selection, but let's check for the existence of 2 green checkmarks in the row.
    # We can fetch the row again by text "Test Product" (since we are not editing anymore, it's text)
    row_after = page.get_by_role("row", name="Test Product")

    # Check for checkmarks
    # We used green-500 class for the checkmarks
    # svg.text-green-500
    expect(row_after.locator("svg.text-green-500")).to_have_count(2)

    page.screenshot(path="verification/verification_quick_edit_success.png")
    print("Verification passed: Checkboxes appeared, were toggled, and state updated.")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_quick_edit_update(page)
        except Exception as e:
            print(f"Test failed: {e}")
            exit(1)
        finally:
            browser.close()

from playwright.sync_api import sync_playwright, expect
import time

def verify_category_edit(page):

    # Mock categories list for parent selection
    page.route("**/api/admin/categories?page=0&size=1000&sort=title,asc", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='{"content": [{"id": "1", "title": "Electronics"}, {"id": "2", "title": "Books"}]}'
    ))

    # Mock create category (POST)
    page.route("**/api/admin/categories", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='{"id": "3", "title": "New Category"}'
    ))

    print("Navigating to Create Category page...")
    # We navigate first, then inject localStorage
    page.goto("http://localhost:3000/admin/categories/create")

    # Inject token after navigation (or before if we use context.add_init_script)
    page.evaluate("localStorage.setItem('auth_token', 'mock_token')")

    # We might need to reload if the app checks auth on mount, but usually the AdminLayout redirects if no token.
    # Since we added it via context.add_init_script in main, it should be fine.

    print("Waiting for form elements...")
    # Verify new fields are present using CSS selectors since labels aren't explicitly associated
    expect(page.locator('input[name="slug"]')).to_be_visible()
    expect(page.locator('input[name="metaTitle"]')).to_be_visible()
    expect(page.locator('textarea[name="metaDescription"]')).to_be_visible()
    expect(page.locator('input[placeholder="Select parent category..."]')).to_be_visible()

    print("Filling form...")
    page.fill('input[name="title"]', "Smartphones")
    page.fill('input[name="slug"]', "smartphones")
    page.fill('input[name="metaTitle"]', "Buy Smartphones")
    page.fill('textarea[name="metaDescription"]', "Best smartphones online")

    print("Selecting parent category...")
    # Interact with SearchSelect
    page.click('input[placeholder="Select parent category..."]')
    page.click('li:has-text("Electronics")')

    print("Taking screenshot...")
    page.screenshot(path="verification/category_edit_form.png", full_page=True)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Add init script to set localStorage before page loads
        context = browser.new_context()
        context.add_init_script("localStorage.setItem('auth_token', 'mock_token');")

        page = context.new_page()
        try:
            verify_category_edit(page)
        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

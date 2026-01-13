
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()

    # Pre-populate localStorage with a fake token to bypass login
    context.add_init_script("""
        localStorage.setItem('auth_token', 'fake.jwt.token');
    """)

    page = context.new_page()

    # Try to navigate to the pages route
    try:
        page.goto("http://localhost:3000/admin/pages", timeout=5000)
        # We expect this to fail or show 404/Empty layout, not a working Pages list
        # Since the route is not defined yet, it probably won't match anything
        # or might fall through to a 404 component if one exists, or just show blank

        # Also check sidebar
        page.goto("http://localhost:3000/admin/dashboard") # or any admin page

        # Check if link exists
        link = page.query_selector("a[href='/admin/pages']")
        if link:
            print("FAILURE: Pages link found in sidebar")
        else:
            print("SUCCESS: Pages link not found in sidebar")

    except Exception as e:
        print(f"Navigation error (expected or unexpected): {e}")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

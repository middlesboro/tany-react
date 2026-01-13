
from playwright.sync_api import sync_playwright

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()

    # Pre-populate localStorage with a fake token to bypass login
    context.add_init_script("""
        localStorage.setItem('auth_token', 'fake.jwt.token');
    """)

    page = context.new_page()

    # Capture console logs to see if API calls are failing
    page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))

    # Mock API responses
    # 1. Mock List Pages
    page.route("**/api/admin/pages?page=0&size=10&sort=title,asc", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='{"content": [{"id": 1, "title": "Test Page", "slug": "test-page", "visible": true}], "totalPages": 1}'
    ))

    # 3. Mock Create Page
    page.route("**/api/admin/pages", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='{"id": 2, "title": "New Page", "slug": "new-page", "visible": true}'
    ))

    # Combined handler for GET /api/admin/pages/1 and PUT /api/admin/pages/1
    def handle_page_detail(route):
        method = route.request.method
        if method == "GET":
            print("Mocking GET request")
            route.fulfill(
                status=200,
                content_type="application/json",
                body='{"id": 1, "title": "Test Page", "slug": "test-page", "description": "<p>Content</p>", "metaTitle": "Meta Title", "metaDescription": "Meta Desc", "visible": true}'
            )
        elif method == "PUT":
            print("Mocking PUT request")
            route.fulfill(
                status=200,
                content_type="application/json",
                body='{"id": 1, "title": "Updated Page"}'
            )
        else:
            route.continue_()

    page.route("**/api/admin/pages/1", handle_page_detail)


    try:
        # Test 1: Navigation and List View
        print("Starting Test 1: List View")
        page.goto("http://localhost:3000/admin/pages")
        page.wait_for_selector("table")

        # Verify mocked data in table
        assert page.is_visible("text=Test Page")
        assert page.is_visible("text=test-page")
        assert page.is_visible("text=Yes") # Visible: true

        print("SUCCESS: List view verified")

        # Test 2: Create Page
        print("Starting Test 2: Create Page")
        page.get_by_text("Create Page").click()
        page.wait_for_selector("form")

        page.fill("input[name='title']", "New Page")
        page.fill("input[name='slug']", "new-page")

        page.click("button:has-text('Save')")
        # Should navigate back to list (which we mocked)
        page.wait_for_url("**/admin/pages")
        print("SUCCESS: Create flow verified")

        # Test 3: Edit Page
        print("Starting Test 3: Edit Page")
        # Go to edit page 1
        page.goto("http://localhost:3000/admin/pages/1")
        page.wait_for_selector("form")

        # Check pre-filled data
        print("Checking title value...")
        # wait for the input to have a value, giving time for the fetch to complete
        page.wait_for_function("document.querySelector(\"input[name='title']\").value !== ''")

        assert page.input_value("input[name='title']") == "Test Page"
        assert page.input_value("input[name='metaTitle']") == "Meta Title"

        print("SUCCESS: Edit flow verified")

        page.screenshot(path="verification/verification.png")

    except Exception as e:
        print(f"Verification failed: {e}")
        page.screenshot(path="verification/failure.png")
        raise e

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

import json
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Mock API responses
    def handle_params(route):
        route.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps({
                "content": [
                    {"id": "p1", "name": "Color", "type": "TAG", "active": True},
                    {"id": "p2", "name": "Size", "type": "TAG", "active": True}
                ],
                "totalPages": 1
            })
        )

    page.route("**/api/admin/filter-parameters?*", handle_params)

    # Mock Create response and verify payload
    def handle_create(route):
        data = route.request.post_data_json
        print(f"Create Request Payload: {data}")
        if data.get("filterParameterId") == "p1":
            print("VERIFICATION SUCCESS: filterParameterId is present and correct.")
        else:
            print(f"VERIFICATION FAILURE: filterParameterId is missing or incorrect. Got: {data.get('filterParameterId')}")

        route.fulfill(
            status=200,
            content_type="application/json",
            body=json.dumps({"id": "v1", "name": "Red", "active": True, "filterParameterId": "p1"})
        )

    page.route("**/api/admin/filter-parameter-values", handle_create)

    # Bypass login
    page.goto("http://localhost:3000/login")
    page.evaluate("localStorage.setItem('auth_token', 'mock_token')")
    page.evaluate("localStorage.setItem('user', JSON.stringify({username: 'admin', role: 'ADMIN'}))")

    # Navigate to create page
    page.goto("http://localhost:3000/admin/filter-parameter-values/create")

    # Wait for the select to load
    page.wait_for_selector("input[placeholder='Select Filter Parameter']")

    # Select "Color"
    page.fill("input[placeholder='Select Filter Parameter']", "Color")
    # Click the option (SearchSelect usually renders a list)
    page.click("li:has-text('Color')")

    # Fill Name
    page.fill("input[name='name']", "Red")

    # Screenshot
    page.screenshot(path="verification.png")
    print("Screenshot taken.")

    # Save
    page.click("button:has-text('Save')")

    # Wait a bit to ensure request is captured
    page.wait_for_timeout(1000)

    browser.close()

with sync_playwright() as playwright:
    run(playwright)

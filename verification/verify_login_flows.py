from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Mock API login - specific to API endpoint
        # The app uses /api/login for the POST request
        page.route("**/api/login", lambda route: route.fulfill(status=200, body='{}'))

        print("Testing Admin Login Flow...")
        try:
            page.goto("http://localhost:3000/admin/login")
            # Wait for title
            page.wait_for_selector("h2")

            # Check Title
            title = page.inner_text("h2")
            print(f"Admin Page Title: {title}")
            assert "Admin Login" in title

            # Check Layout
            bg_color_present = page.locator(".bg-gray-100").count() > 0
            print(f"Admin Layout (bg-gray-100 present): {bg_color_present}")
            assert bg_color_present

            # Check LocalStorage on Submit
            page.fill("#email", "admin@example.com")
            page.click("button[type='submit']")
            page.wait_for_timeout(1000) # Wait for async JS

            redirect_path = page.evaluate("localStorage.getItem('post_login_redirect')")
            print(f"Admin Redirect Path stored: {redirect_path}")
            assert redirect_path == "/admin/carts"

            print("Admin Flow Verified Successfully.")

        except Exception as e:
            print(f"Admin Flow Failed: {e}")
            page.screenshot(path="verification_failure_admin.png")
            raise e

        print("\nTesting Customer Login Flow...")
        try:
            # Go to home first
            page.goto("http://localhost:3000/")
            page.wait_for_load_state("networkidle")

            # Click Prihlásenie
            # It's in the top bar.
            page.click("text=Prihlásenie")

            # Verify URL
            print(f"Current URL: {page.url}")
            assert "/login" in page.url

            # Verify Title
            page.wait_for_selector("h2")
            title = page.inner_text("h2")
            print(f"Customer Page Title: {title}")
            assert "Prihlásenie" in title

            # Verify Layout (Should NOT have bg-gray-100 on the main container)
            # We check that .bg-gray-100 is NOT present on the specific login container.
            # But wait, the admin one has it on the container. The customer one has .my-10.
            # Let's check for .my-10.
            my_10_present = page.locator(".my-10").count() > 0
            print(f"Customer Layout (my-10 present): {my_10_present}")
            assert my_10_present

            # Check LocalStorage on Submit
            page.fill("#email", "customer@example.com")
            page.click("button[type='submit']")
            page.wait_for_timeout(1000)

            redirect_path = page.evaluate("localStorage.getItem('post_login_redirect')")
            print(f"Customer Redirect Path stored: {redirect_path}")

            # It should be '/' because we came from Home
            assert redirect_path == "/"

            print("Customer Flow Verified Successfully.")

        except Exception as e:
            print(f"Customer Flow Failed: {e}")
            page.screenshot(path="verification_failure_customer.png")
            raise e

        browser.close()

if __name__ == "__main__":
    run()

from playwright.sync_api import sync_playwright

def verify_sidebar():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Inject auth token to bypass login
        page.goto('http://localhost:3000/admin/login')
        page.evaluate("localStorage.setItem('auth_token', 'dummy_token')")

        # Go to admin dashboard
        page.goto('http://localhost:3000/admin')

        try:
            # Wait for layout to load
            page.wait_for_selector('nav', timeout=5000)

            # 1. Verify "Catalog" group
            print("Checking for 'Catalog' group...")
            catalog_btn = page.get_by_text("Catalog", exact=True)
            if catalog_btn.count() == 0:
                print("FAIL: 'Catalog' group not found.")
            else:
                catalog_btn.click()
                # Check for "Products" under Catalog
                products_link = page.get_by_role("link", name="Products")
                if products_link.is_visible():
                     print("SUCCESS: Found 'Products' link under 'Catalog'.")
                else:
                     print("FAIL: 'Products' link not visible after clicking 'Catalog'.")

            # 2. Verify "Orders" group
            print("Checking for 'Orders' group...")
            orders_btn = page.get_by_text("Orders", exact=True)
            if orders_btn.count() == 0:
                print("FAIL: 'Orders' group not found.")
            else:
                orders_btn.click()
                if page.get_by_role("link", name="Carts").is_visible():
                    print("SUCCESS: Found 'Carts' link under 'Orders'.")

            # 3. Verify "Settings" group
            print("Checking for 'Settings' group...")
            settings_btn = page.get_by_text("Settings", exact=True)
            if settings_btn.count() == 0:
                print("FAIL: 'Settings' group not found.")
            else:
                settings_btn.click()
                if page.get_by_role("link", name="Shop Settings").is_visible():
                    print("SUCCESS: Found 'Shop Settings' link under 'Settings'.")

            # 4. Verify top-level links
            print("Checking for top-level links...")
            if page.get_by_role("link", name="Pages").is_visible():
                print("SUCCESS: Found 'Pages' link.")
            else:
                print("FAIL: 'Pages' link not found.")

            if page.get_by_role("link", name="Blogs").is_visible():
                print("SUCCESS: Found 'Blogs' link.")
            else:
                print("FAIL: 'Blogs' link not found.")

        except Exception as e:
            print(f"Error during verification: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_sidebar()

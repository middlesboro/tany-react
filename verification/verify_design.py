from playwright.sync_api import sync_playwright

def verify_design():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Intercept and mock API calls
        # Mock Customers Context
        page.route("**/api/customers/context", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body='{"cartId": "test-cart-id", "customer": null}'
        ))

        # Mock Products
        page.route("**/api/products*", lambda route: route.fulfill(
            status=200,
            content_type="application/json",
            body='''{
                "content": [
                    {
                        "id": 1,
                        "title": "Natural Henna Powder",
                        "price": 12.90,
                        "images": ["https://via.placeholder.com/150"]
                    },
                     {
                        "id": 2,
                        "title": "Ayurvedic Hair Oil",
                        "price": 24.50,
                        "images": []
                    }
                ],
                "totalPages": 1,
                "totalElements": 2
            }'''
        ))

        try:
            print("Navigating to home page...")
            page.goto("http://localhost:3000/")
            page.wait_for_load_state("networkidle")

            # Check for Logo
            logo = page.locator("img[alt='Tany.sk']")
            if logo.is_visible():
                print("SUCCESS: Logo found.")
            else:
                print("FAILURE: Logo not found.")

            # Check for specific hardcoded nav items
            nav_item = page.get_by_text("HENNA NA VLASY")
            if nav_item.is_visible():
                print("SUCCESS: Navigation item 'HENNA NA VLASY' found.")
            else:
                print("FAILURE: Navigation item 'HENNA NA VLASY' not found.")

            # Check for footer column
            footer_col = page.get_by_text("Kontaktné informácie")
            if footer_col.is_visible():
                print("SUCCESS: Footer column 'Kontaktné informácie' found.")
            else:
                print("FAILURE: Footer column 'Kontaktné informácie' not found.")

            # Check for contact info - handle potential duplicates (header and footer)
            phones = page.get_by_text("+421 944 432 457")
            if phones.count() > 0:
                print(f"SUCCESS: Phone number found {phones.count()} times.")
            else:
                print("FAILURE: Phone number not found.")

            # Capture screenshot
            page.screenshot(path="verification/design_verification.png", full_page=True)
            print("Screenshot saved to 'verification/design_verification.png'.")

        except Exception as e:
            print(f"An error occurred: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_design()

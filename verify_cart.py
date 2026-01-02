
from playwright.sync_api import sync_playwright
import json

def verify_cart(page):
    # Mock List API
    page.route("**/api/admin/carts", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body=json.dumps([
            {
                "cartId": "123",
                "customerName": "John Doe",
                "createDate": "2023-10-26T10:00:00Z",
                "updateDate": "2023-10-26T12:00:00Z"
            },
            {
                "cartId": "456",
                "customerName": "Jane Smith",
                "createDate": "2023-10-27T10:00:00Z",
                "updateDate": "2023-10-27T12:00:00Z"
            }
        ])
    ))

    # Mock Detail API
    page.route("**/api/admin/carts/123", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body=json.dumps({
            "cartId": "123",
            "customerName": "John Doe",
            "createDate": "2023-10-26T10:00:00Z",
            "updateDate": "2023-10-26T12:00:00Z",
            "items": [
                {
                    "productId": "p1",
                    "quantity": 2,
                    "title": "Awesome Product",
                    "image": "https://via.placeholder.com/150",
                    "price": 19.99
                },
                {
                    "productId": "p2",
                    "quantity": 1,
                    "title": "Another Product",
                    "image": "",
                    "price": 9.99
                }
            ]
        })
    ))

    # Set Auth Token
    page.add_init_script("""
        localStorage.setItem('auth_token', 'fake-token');
    """)

    # Go to Carts List
    page.goto("http://localhost:3000/admin/carts")

    # Wait for list to load
    page.wait_for_selector("text=John Doe")

    # Take screenshot of list
    page.screenshot(path="verification_list.png")
    print("List screenshot taken")

    # Click Detail
    # Using the first detail button
    page.click("a[href='/admin/carts/123']")

    # Wait for detail to load
    page.wait_for_selector("text=Awesome Product")

    # Take screenshot of detail
    page.screenshot(path="verification_detail.png")
    print("Detail screenshot taken")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_cart(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

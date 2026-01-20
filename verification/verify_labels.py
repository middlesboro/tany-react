from playwright.sync_api import sync_playwright, expect

def test_product_labels(page):
    # 1. Categories (Tree)
    page.route("**/api/categories", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='[{"id": 1, "title": "Test Category", "slug": "test-category", "children": []}]'
    ))

    # 2. Product Search (POST)
    # Pattern: **/api/products/category/*/search*
    page.route("**/api/products/category/*/search*", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='''{
            "products": {
                "content": [
                    {
                        "id": 1,
                        "title": "Product with Labels",
                        "price": 10.0,
                        "images": [],
                        "productLabels": [
                            {
                                "title": "New",
                                "color": "#FFFFFF",
                                "backgroundColor": "#FF0000",
                                "position": "TOP_LEFT"
                            },
                            {
                                "title": "Sale",
                                "color": "#FFFFFF",
                                "backgroundColor": "#0000FF",
                                "position": "BOTTOM_RIGHT"
                            }
                        ]
                    }
                ],
                "totalPages": 1
            },
            "filterParameters": []
        }'''
    ))

    # 3. Product Detail
    page.route("**/api/products/1", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='''{
            "id": 1,
            "title": "Product with Labels",
            "price": 10.0,
            "description": "Description",
            "images": [],
            "productLabels": [
                {
                    "title": "New",
                    "color": "#FFFFFF",
                    "backgroundColor": "#FF0000",
                    "position": "TOP_LEFT"
                },
                {
                    "title": "Sale",
                    "color": "#FFFFFF",
                    "backgroundColor": "#0000FF",
                    "position": "BOTTOM_RIGHT"
                }
            ],
            "categoryId": 1
        }'''
    ))

    # 4. Reviews
    page.route("**/api/products/1/reviews", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='{"reviews": {"content": []}, "averageRating": 0, "reviewsCount": 0}'
    ))

    # 1. Verify List View
    print("Navigating to category page...")
    page.goto("http://localhost:3000/category/test-category")

    # Wait for product card
    print("Waiting for product card...")
    page.wait_for_selector("text=Product with Labels")

    # Check for labels
    print("Checking for labels on list view...")
    # Use exact=True to avoid matching "Newsletter"
    expect(page.get_by_text("New", exact=True)).to_be_visible()
    expect(page.get_by_text("Sale", exact=True)).to_be_visible()

    page.screenshot(path="verification/product_list_labels.png")
    print("Screenshot saved: verification/product_list_labels.png")

    # 2. Verify Detail View
    print("Navigating to product detail...")
    # Click the product link
    page.get_by_role("link", name="Product with Labels").first.click()

    # Wait for detail content
    print("Waiting for detail content...")
    page.wait_for_selector("h1:has-text('Product with Labels')")

    # Check for labels
    print("Checking for labels on detail view...")
    expect(page.get_by_text("New", exact=True)).to_be_visible()
    expect(page.get_by_text("Sale", exact=True)).to_be_visible()

    page.screenshot(path="verification/product_detail_labels.png")
    print("Screenshot saved: verification/product_detail_labels.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_product_labels(page)
        except Exception as e:
            print(f"Test failed: {e}")
            page.screenshot(path="verification/error.png")
        finally:
            browser.close()

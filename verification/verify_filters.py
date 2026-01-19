import time
from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context()
    page = context.new_page()

    # Mock categories
    page.route("**/api/categories", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='''[
            {
                "id": 1,
                "title": "Electronics",
                "slug": "electronics",
                "children": [],
                "filterParameters": []
            }
        ]'''
    ))

    # Mock products and filters
    page.route("**/api/products/category/1/search?**", lambda route: route.fulfill(
        status=200,
        content_type="application/json",
        body='''{
            "products": {
                "content": [],
                "totalPages": 0,
                "totalElements": 0,
                "number": 0,
                "size": 12
            },
            "filterParameters": [
                {
                    "id": 101,
                    "name": "Brand",
                    "values": [
                        {"id": 1, "name": "Apple"},
                        {"id": 2, "name": "Samsung"}
                    ]
                },
                {
                    "id": 102,
                    "name": "Color",
                    "values": [
                        {"id": 3, "name": "Black"},
                        {"id": 4, "name": "White"}
                    ]
                },
                {
                    "id": 103,
                    "name": "Size",
                    "values": [
                        {"id": 5, "name": "Small"},
                        {"id": 6, "name": "Large"}
                    ]
                }
            ]
        }'''
    ))

    try:
        page.goto("http://localhost:3000/category/electronics")

        # Wait for filters to load
        header = page.locator("h3", has_text="Filtrovať produkty")
        header.wait_for()

        # The container is the sibling div
        filter_container = header.locator("xpath=following-sibling::div[1]")

        # Take a screenshot
        page.screenshot(path="verification/verification_after.png")

        # Check if class contains flex and flex-wrap
        class_attr = filter_container.get_attribute("class")
        print(f"Container class: {class_attr}")

        if class_attr and "flex" in class_attr and "flex-wrap" in class_attr:
            print("Verified: flex and flex-wrap are present")
        else:
            print(f"Warning: Expected classes not found. HTML: {filter_container.evaluate('el => el.outerHTML')}")

        # Check inner divs for min-w-[150px]
        # We need to wait for children to render first, wait_for_selector on container might help
        filter_container.locator("div").first.wait_for()
        inner_div = filter_container.locator("div").first
        inner_class = inner_div.get_attribute("class")
        print(f"Inner div class: {inner_class}")

        if inner_class and "min-w-[150px]" in inner_class:
            print("Verified: min-w-[150px] is present on inner div")
        else:
             print("Warning: min-w-[150px] not found on inner div")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        browser.close()

if __name__ == "__main__":
    with sync_playwright() as playwright:
        run(playwright)

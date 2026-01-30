from playwright.sync_api import sync_playwright
import time

def verify_review_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        try:
            # Navigate to the page
            page.goto("http://localhost:3001/farbynavlasy-recenzie")

            # Wait for content to load
            page.wait_for_selector("h1")

            # Verify Title
            h1_text = page.text_content("h1")
            print(f"H1 content: {h1_text}")
            assert "Farby na vlasy - recenzie a skúsenosti" in h1_text

            # Verify Description
            description_text = page.text_content("div.whitespace-pre-line")
            print(f"Description content: {description_text}")
            assert "Pripravili sme si pre Vás zoznam recenzií" in description_text

            # Take screenshot
            page.screenshot(path="verification_review_page.png")
            print("Screenshot saved to verification_review_page.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="verification_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_review_page()

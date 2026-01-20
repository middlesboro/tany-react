
from playwright.sync_api import sync_playwright

def verify_slider(page):
    page.goto('http://localhost:3000')
    # Wait for the slider to be visible
    page.wait_for_selector('.w-full.relative.group.mb-8')

    # We want to verify desktop size
    page.set_viewport_size({'width': 1280, 'height': 800})

    # Take a screenshot
    page.screenshot(path='/home/jules/verification/slider_desktop.png')

    # Also verify the computed style height if possible, or just rely on screenshot.
    slider = page.locator('.w-full.relative.group.mb-8 > div:first-child')
    box = slider.bounding_box()
    print(f'Slider height at 1280px width: {box["height"]}')

if __name__ == '__main__':
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_slider(page)
        except Exception as e:
            print(e)
        finally:
            browser.close()

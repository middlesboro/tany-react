import asyncio
from playwright.async_api import async_playwright
import time

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        print("Navigating to homepage...")
        await page.goto("http://localhost:3001/")

        # Handle cookie banner
        try:
            await page.wait_for_selector("button:has-text('Prijať všetko')", timeout=5000)
            await page.click("button:has-text('Prijať všetko')")
            print("Accepted cookies")
            await asyncio.sleep(1)
        except Exception as e:
            print("No cookie banner found or failed to click:", e)

        print("Waiting for products on homepage...")
        await page.wait_for_selector("a[href^='/produkt/']", timeout=10000)

        # Get the first product link
        product_link = await page.get_attribute("a[href^='/produkt/']", "href")
        print(f"Found product link: {product_link}")

        print("Navigating to product detail page...")
        await page.goto(f"http://localhost:3001{product_link}")

        print("Waiting for product title and brand link...")
        await page.wait_for_selector("h1", timeout=10000)

        # Take a screenshot
        await page.screenshot(path="product_detail.png", full_page=True)
        print("Screenshot saved to product_detail.png")

        # Verify the brand link exists
        try:
            brand_link = await page.wait_for_selector("a[href^='/kategoria/vsetky-produkty?q=Brand-']", timeout=5000)
            if brand_link:
                print("SUCCESS: Brand link found on product detail page!")
                brand_text = await brand_link.inner_text()
                brand_href = await brand_link.get_attribute("href")
                print(f"Brand Text: {brand_text}")
                print(f"Brand Href: {brand_href}")
            else:
                print("FAILURE: Brand link not found!")
        except Exception as e:
            print("FAILURE: Could not find brand link.", e)

        await browser.close()

asyncio.run(main())

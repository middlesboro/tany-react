import asyncio
from playwright.async_api import async_playwright
import json

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()

        # We don't mock the APIs, just let it use real APIs. We will just search the search bar for an existing product to click.

        print("Navigating to homepage...")
        await page.goto("http://localhost:3001/")

        await asyncio.sleep(2)
        try:
            await page.wait_for_selector("button:has-text('Prijať všetko')", timeout=2000)
            await page.click("button:has-text('Prijať všetko')")
            print("Accepted cookies")
        except:
            pass

        print("Using search bar...")
        # Type into the search input
        await page.fill("input[placeholder='Hľadať v obchode...']", "vlasy")

        print("Waiting for search results dropdown...")
        await page.wait_for_selector("a[href^='/produkt/']", timeout=10000)

        product_link = await page.get_attribute("a[href^='/produkt/']", "href")
        print(f"Found product link from search: {product_link}")

        print(f"Navigating to product detail page: http://localhost:3001{product_link}")
        await page.goto(f"http://localhost:3001{product_link}")

        await page.wait_for_selector("h1", timeout=10000)

        # Take a screenshot
        await page.screenshot(path="product_detail_real.png", full_page=True)
        print("Screenshot saved to product_detail_real.png")

        try:
            brand_link = page.locator("a[href^='/kategoria/vsetky-produkty?q=Brand-']").first
            brand_count = await brand_link.count()
            if brand_count > 0:
                print("SUCCESS: Brand link found on product detail page!")
                brand_text = await brand_link.inner_text()
                brand_href = await brand_link.get_attribute("href")
                print(f"Brand Text: {brand_text}")
                print(f"Brand Href: {brand_href}")
            else:
                print("Brand link not found (Maybe this product has no brand).")
        except Exception as e:
            print("FAILURE: Could not find brand link.", e)

        await browser.close()

asyncio.run(main())

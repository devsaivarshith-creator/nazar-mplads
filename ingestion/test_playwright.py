import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        try:
            await page.goto("https://mplads.gov.in/MPLADS/MemberWiseReport.aspx", timeout=30000)
            print("Successfully loaded the page!")
            title = await page.title()
            print("Title:", title)
            content = await page.content()
            print("Content length:", len(content))
        except Exception as e:
            print("Failed to load page:", e)
        finally:
            await browser.close()

if __name__ == "__main__":
    asyncio.run(main())

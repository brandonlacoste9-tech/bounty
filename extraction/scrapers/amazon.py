import asyncio
import random
import json
from playwright.async_api import async_playwright

async def hunt_amazon():
    """
    Scrapes Amazon 'Movers & Shakers' or 'Goldbox' for highly volatile deals.
    Target: Electronics & Video Games (Cyber-relevant).
    """
    print("🐺 NOSE: Sniffing Amazon Sector [Goldbox]...")
    intel_bag = []

    async with async_playwright() as p:
        # Launch with Stealth-like args to avoid immediate detection
        browser = await p.chromium.launch(
            headless=True,
            args=[
                '--disable-blink-features=AutomationControlled',
                '--no-sandbox',
                '--disable-setuid-sandbox'
            ]
        )
        context = await browser.new_context(
            user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            viewport={'width': 1280, 'height': 800}
        )
        
        page = await context.new_page()

        try:
            # Target: Amazon Best Sellers / Movers (often has discounted viral items)
            # We use 'Movers and Shakers' in Electronics as a proxy for "Hot Tech"
            url = "https://www.amazon.com/gp/movers-and-shakers/electronics/"
            
            print(f"🐺 NOSE: Infiltrating {url}")
            await page.goto(url, timeout=15000, wait_until="domcontentloaded")
            
            # Allow dynamic content to load
            await page.wait_for_timeout(2000)

            # Selectors for Grid Items
            # Amazon layout changes often, but usually .zg-grid-general-faceout
            grid_items = await page.locator("div.zg-grid-general-faceout").all()

            if not grid_items:
                 print("⚠️ SIGNAL WEAK: Amazon anti-bot shields may be active (Grid not found).")

            print(f"🐺 NOSE: Detected {len(grid_items)} potential signals.")

            for i, card in enumerate(grid_items[:8]): # Grab top 8
                try:
                    # Extract Data Points
                    # Title usually in a div or span under the image
                    title_elem = card.locator("div._cDEzb_p13n-sc-css-line-clamp-3_g3dy1")
                    if await title_elem.count() == 0:
                         title_elem = card.locator("div[class*='p13n-sc-css-line-clamp']")
                    
                    title = await title_elem.first.inner_text() if await title_elem.count() > 0 else "Unknown Asset"

                    # Price
                    price_elem = card.locator("span.p13n-sc-price")
                    price = await price_elem.first.inner_text() if await price_elem.count() > 0 else "Unknown"

                    # Image
                    img_elem = card.locator("img")
                    img_src = await img_elem.first.get_attribute("src") if await img_elem.count() > 0 else ""

                    # Link
                    link_elem = card.locator("a.a-link-normal")
                    link = await link_elem.first.get_attribute("href") if await link_elem.count() > 0 else ""
                    full_link = f"https://www.amazon.com{link}" if link.startswith("/") else link

                    # Construct Intel Packet
                    # Only add if we have a valid price (filter out unavailable items)
                    if price != "Unknown":
                        intel = {
                            "id": random.randint(10000, 99999),
                            "brand": title[:30] + "..." if len(title) > 30 else title,
                            "title": title,
                            "summary": f"Trending on Amazon: {title}",
                            "price": price,
                            "original_price": "", # Hard to get reliable MSRP on this page
                            "discount": "HOT",
                            "value_score": random.randint(75, 95), # Simulation for now
                            "duration_months": 1,
                            "url": full_link,
                            "image": img_src,
                            "source": "AMAZON",
                            "verdict": "TRENDING"
                        }
                        intel_bag.append(intel)
                        print(f"   + Snagged: {intel['brand']}")

                except Exception as e:
                    # Stealth failure, move to next target
                    continue

        except Exception as e:
            print(f"🚨 NOSE FAILURE: {e}")

        finally:
            await browser.close()

    return intel_bag

if __name__ == "__main__":
    deals = asyncio.run(hunt_amazon())
    print(json.dumps(deals, indent=2))

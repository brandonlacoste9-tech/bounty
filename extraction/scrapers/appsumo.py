import asyncio
from playwright.async_api import async_playwright
import json
import random

USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0"
]

async def hunt_appsumo():
    """
    INFILTRATION TARGET: AppSumo.com (Browse Section)
    OBJECTIVE: Extract Lifetime Deals (LTDs) with high ratings.
    """
    print("🐺 NOSE: Infiltrating AppSumo Sector...")
    
    intel_bag = []

    async with async_playwright() as p:
        # Stealth Mode: Random Agent + Headless
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent=random.choice(USER_AGENTS),
            viewport={'width': 1920, 'height': 1080}
        )
        
        page = await context.new_page()
        
        try:
            # 1. Approach Target
            await page.goto("https://appsumo.com/browse/", timeout=60000)
            await page.wait_for_load_state("networkidle")
            
            # 2. Sniff Patterns (Deal Cards)
            # AppSumo classes change, so we rely on structural locators if possible, or common classes.
            # Looking for the main grid items.
            deal_cards = await page.locator(".deal-tile").all()
            
            print(f"🐺 NOSE: Detected {len(deal_cards)} potential signals.")

            for i, card in enumerate(deal_cards[:8]): # Grab top 8
                try:
                    # Extract Data Points
                    title = await card.locator("h3").first.inner_text(timeout=2000)
                    
                    # Prices often structured like "$39 $100"
                    price_text = await card.locator("[data-test-id='price']").first.inner_text(timeout=2000)
                    
                    # Image for the dashboard
                    img_src = await card.locator("img").first.get_attribute("src")
                    
                    # Link
                    link = await card.locator("a").first.get_attribute("href")
                    full_link = f"https://appsumo.com{link}" if link.startswith("/") else link

                    # Construct Intel Packet
                    intel = {
                        "id": random.randint(1000, 9999),
                        "brand": title,
                        "summary": f"Lifetime Deal spotted: {price_text.replace(chr(10), ' ')}",
                        "value_score": 90, # Placeholder, will be AI evaluated later
                        "discount_amount": 0, # Logic to extract later
                        "duration_months": 99, # Code for Lifetime
                        "url": full_link,
                        "image": img_src,
                        "verdict": "UNVERIFIED LTD"
                    }
                    intel_bag.append(intel)
                    print(f"   + Snagged: {title}")
                    
                except Exception as e:
                    # Stealth failure, move to next target
                    continue

        except Exception as e:
            print(f"🚨 NOSE FAILURE: {e}")
        
        finally:
            await browser.close()
            
    return intel_bag

# For local testing
if __name__ == "__main__":
    deals = asyncio.run(hunt_appsumo())
    print(json.dumps(deals, indent=2))

import os
import google.generativeai as genai
import requests
from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import json
import asyncio
import sys

# Ensure extraction modules can be imported
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), "extraction"))

try:
    from extraction.trigger import main as run_nose
except ImportError:
    print("Warning: Could not import Nose directly. Using subprocess fallback if needed.")
    run_nose = None

app = FastAPI()

# --- 1. AUTHENTICATION (API KEY MODE) ---
# Switching to API Key mode as requested.
# Key provided by user via secure channel.
API_KEY = "AQ.Ab8RN6I-SAdHl4YXADA3hHfPFgrymx9-COE_SA7uhW2eYl4iHg"

# --- 2. CONFIGURATION ---
MODEL_NAME = "gemini-1.5-flash"  # Using stable Flash model

# --- 3. IGNITE GEMINI ---
try:
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel(MODEL_NAME)
    print(f"🟢 Gemini AI Online ({MODEL_NAME}). Neural Link Established.")
except Exception as e:
    print(f"⚠️ Gemini Initialization Failed: {e}")
    model = None

# --- 4. CORS (The Bridge) ---
origins = ["http://localhost:5173", "http://localhost:3000", "*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

LATEST_DEALS_FILE = "latest_deals.json"

@app.get("/api/intel")
def get_intel():
    if os.path.exists(LATEST_DEALS_FILE):
        try:
            with open(LATEST_DEALS_FILE, "r") as f:
                return json.load(f)
        except: return []
    return []

@app.get("/api/activity")
def get_activity():
    # Mock activity stream
    return [
        {"id": 1, "type": "SCAN", "message": "Pinging Adobe Creative Cloud...", "timestamp": "Now"},
        {"id": 2, "type": "AI", "message": "Brain analyzing SaaS pricing models...", "timestamp": "5s ago"},
        {"id": 3, "type": "PROXY", "message": "Redirected user to Shopify (Affiliate ID: #9921)", "timestamp": "12s ago"}
    ]

# --- 5. THE HUNTING ENDPOINT ---
@app.get("/api/test_sniff")
def test_sniff():
    """
    MISSION VERIFICATION: Proves Cyberhound can 'sniff' a deal from raw text.
    Simulates reading a messy pricing page and extracting the 'Gold'.
    """
    print("🐺 Sniffing for DEALS...")
    
    # 1. The Raw Input (Simulating what the Nose scrapes from a site like Shopify or Adobe)
    raw_html_snippet = """
    <html>
      <h1>Start your business today</h1>
      <p class="promo">Special Offer!</p>
      <div class="pricing">
         Sign up now and get <strong>3 months for $1/month</strong> on select plans.
         Normal price $39/month. 
         Free trial available for 3 days.
      </div>
    </html>
    """
    
    try:
        # 2. The Brain (Gemini Analysis)
        if model:
            prompt = f"""
            System: You are Cyberhound, a deal-hunting AI.
            Task: Extract the specific 'Deal' from this raw text.
            Raw Text: "{raw_html_snippet}"
            
            Return ONLY a clean JSON object with these keys:
            - Brand (Guess based on context if missing, or 'Unknown')
            - Discount_Summary (e.g. '3 Months for $1')
            - Trial_Period (e.g. '3 Days')
            - Verdict (Is this a 'Good Deal', 'Bad Deal', or 'Standard'?)
            """
            
            ai_response = model.generate_content(prompt)
            data = ai_response.text.strip()
            # Cleanup markdown if Gemini wraps it
            data = data.replace("```json", "").replace("```", "")
        else:
            data = {"error": "AI Offline", "raw": raw_html_snippet}

        return {
            "mission": "Deal Extraction",
            "extracted_intel": json.loads(data) if isinstance(data, str) and "{" in data else data,
            "status": "SUCCESS"
        }
    except Exception as e:
        return {
            "mission": "Deal Extraction",
            "error": str(e),
            "status": "FAILED"
        }
from extraction.scrapers.appsumo import hunt_appsumo
from extraction.scrapers.amazon import hunt_amazon
from social_poster import broadcast

# --- 6. OPERATION DEEP SNIFF (Enhanced Scan) ---
@app.post("/api/scan")
async def trigger_scan(target: str = "appsumo"):
    """
    Activates the Enhanced Nose to hunt specific targets.
    Default: AppSumo (Lifetime Deals).
    """
    print(f"🐺 COMMAND RECEIVED: Hunt Target [{target.upper()}]")
    
    try:
        # A. THE NOSE (Scraping)
        if target == "appsumo":
             raw_intel = await hunt_appsumo()
        else:
             return {"status": "FAILED", "reason": "Unknown Sector"}

        # B. THE BRAIN (Analysis - Optional for now, just pass through)
        # In Phase 3, we will pass 'raw_intel' to Gemini to grade the deals (Value Score).
        
        # C. STORAGE (Save to 'latest_deals.json' for the frontend)
        # For now, we overwrite the feed. In future, we append.
        with open("latest_deals.json", "w") as f:
            json.dump(raw_intel, f)

        return {
            "mission": "Operation Deep Sniff",
            "target": target,
            "intel_count": len(raw_intel),
            "status": "SUCCESS",
            "intel": raw_intel
        }

    except Exception as e:
        print(f"🚨 MISSION FAILURE: {e}")
        return {"status": "FAILED", "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)



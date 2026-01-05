import os
import json
import google.generativeai as genai
from datetime import datetime

# --- CONFIGURATION ---
HISTORY_FILE = "posted_log.json"
TWITTER_API_KEY = os.getenv("TWITTER_API_KEY")
TWITTER_API_SECRET = os.getenv("TWITTER_API_SECRET")

# Initialize Gemini (The Cortex)
# Try main key then fallback
apikey = os.getenv("GEMINI_API_KEY") or os.getenv("API_KEY")
if apikey:
    genai.configure(api_key=apikey)

# --- 1. THE MEMORY (Deduplication) ---
def load_history():
    if not os.path.exists(HISTORY_FILE):
        return []
    try:
        with open(HISTORY_FILE, "r") as f:
            return json.load(f)
    except:
        return []

def save_history(history):
    with open(HISTORY_FILE, "w") as f:
        json.dump(history, f)

def is_posted(deal_id):
    history = load_history()
    return str(deal_id) in history

def mark_posted(deal_id):
    history = load_history()
    history.append(str(deal_id))
    save_history(history)

# --- 2. THE CORTEX (AI Copywriting) ---
async def generate_tweet(deal):
    """
    Uses Gemini to craft a viral, cyberpunk-themed tweet.
    """
    if not apikey:
        return f"🚨 SIGNAL DETECTED: {deal.get('brand')} - {deal.get('price')} \n{deal.get('url')}"

    model = genai.GenerativeModel("gemini-1.5-flash")
    
    prompt = f"""
    You are Cyberhound, an elite autonomous deal hunter.
    Write a short, urgent, cyberpunk-style tweet (max 200 chars) for this deal:
    
    Product: {deal.get('title') or deal.get('brand')}
    Price: {deal.get('price')}
    Discount: {deal.get('discount', 'Unknown')}
    Source: {deal.get('source', 'Unknown')}
    
    - Tone: Urgent, Insider, "Signal Detected".
    - Use 1-2 emojis (e.g. 🚨, 🐺, 📉).
    - Do NOT use hashtags like #Deal. use #Cyberhound or #Tech.
    - END with the URL: {deal.get('url')}
    """
    
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"🧠 CORTEX FAILURE: {e}")
        return f"🚨 SIGNAL DETECTED: {deal.get('brand')} - {deal.get('price')} \n{deal.get('url')}"

# --- 3. THE TRANSMITTER (Broadcasting) ---
async def broadcast(deal):
    if is_posted(deal['id']):
        # Stealth mode: don't spam console
        return "SKIPPED"

    print(f"⚡ CORTEX: Analyzing {deal['brand']}...")
    tweet_content = await generate_tweet(deal)
    
    # --- TRANSMISSION PATHS ---
    if TWITTER_API_KEY:
        # PATH A: OFFICIAL API (To be implemented with Tweepy/Requests)
        print(f"🐦 [OFFICIAL CHANNEL] Posting: {tweet_content}")
        # TODO: Implement actual API call here
        pass 
    else:
        # PATH B: ROGUE MODE (Console Simulation for now)
        print(f"🏴‍☠️ [ROGUE SIMULATION] Tweet Generated:\n{'-'*20}\n{tweet_content}\n{'-'*20}")
    
    mark_posted(deal['id'])
    return "POSTED"

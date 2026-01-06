from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import uvicorn
import json
from extraction.scrapers.bounty_hunter import hunt_bounties

app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Cyberhound Neural Net Online", "version": "3.3"}

@app.get("/latest_deals.json")
def get_intel():
    """
    Returns the latest intercepted bounties.
    If the file exists, reading from it (cache).
    If not, it triggers a fresh hunt.
    """
    try:
        if os.path.exists("latest_deals.json"):
            with open("latest_deals.json", "r") as f:
                data = json.load(f)
                return data
        else:
            # First run auto-trigger
            return hunt_bounties()
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/scan")
async def trigger_scan():
    """
    Activates the Headhunter Protocol.
    Scrapes real jobs and converts them to Bounties.
    """
    print("🐺 COMMAND RECEIVED: Initiate Headhunter Protocol")

    try:
        # 1. EXECUTE THE HUNT
        new_intel = hunt_bounties()
        
        # 2. SAVE INTEL (To local JSON for the frontend to read)
        with open("latest_deals.json", "w") as f:
            json.dump(new_intel, f)

        return {
            "mission": "Headhunter Scan",
            "intel_count": len(new_intel),
            "status": "SUCCESS",
            "intel": new_intel
        }

    except Exception as e:
        print(f"�� MISSION FAILURE: {e}")
        return {"status": "FAILED", "error": str(e)}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run(app, host="0.0.0.0", port=port)

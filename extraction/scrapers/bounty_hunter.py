import requests
import random
import uuid
import re

def hunt_bounties():
    print("🐺 HEADHUNTER: Scanning Remote Frequencies for Targets...")
    
    # TARGET: RemoteOK API
    url = "https://remoteok.com/api"
    headers = {'User-Agent': 'Cyberhound-Bounty-Board/1.0'}
    
    try:
        response = requests.get(url, headers=headers)
        jobs = response.json()
        
        # The API returns a list, the first item is legal text, skip it.
        valid_jobs = jobs[1:]
        
        bounties = []
        
        # Limit to 12 freshest targets
        for job in valid_jobs[:12]:
            
            # --- THE SPIN: FLAVOR TEXT GENERATION ---
            title = job.get('position', '').upper()
            company = job.get('company', 'UNKNOWN SYNDICATE').upper()
            
            # 1. DETERMINE DIFFICULTY & REWARD
            # Make the rewards huge and cryptographically specific to look cool
            if "SENIOR" in title or "LEAD" in title or "ARCHITECT" in title or "CTO" in title:
                difficulty = "LETHAL"
                # Random reward between 2k and 5k USDC
                reward_val = random.randint(20, 50) * 100
            elif "JUNIOR" in title or "ENTRY" in title or "INTERN" in title:
                difficulty = "NOVICE"
                reward_val = random.randint(3, 8) * 100
            else:
                difficulty = "VETERAN"
                reward_val = random.randint(8, 20) * 100
                
            # 2. DETERMINE TYPE
            tags = str(job.get('tags', [])).upper()
            if "DESIGN" in tags or "ART" in tags:
                b_type = "DESIGN"
            elif "MARKETING" in tags or "SALES" in tags or "GROWTH" in tags:
                b_type = "MARKETING"
            elif "PYTHON" in tags or "DEV" in tags or "ENGINEER" in tags or "REACT" in tags:
                b_type = "DEV"
            else:
                b_type = "RECON"

            # 3. "CYBERHOUND SPIN" ON DESCRIPTION
            # Convert normal job descriptions into "Mercenary Briefs"
            # We strip HTML and just grab a snippet, then flavor it.
            tags_clean = [t.upper() for t in job.get('tags', [])[:3]]
            flavor_text = f"TARGET: {company}. OBJECTIVE: {title}. REQUIRES: {', '.join(tags_clean)}."
            
            # 4. BUILD THE BOUNTY OBJECT
            bounty = {
                "id": str(uuid.uuid4())[:8],
                "client": company,
                "task": title,
                "description": flavor_text,
                "reward": f"${reward_val} USDC",
                "difficulty": difficulty,
                "type": b_type,
                "status": "OPEN",
                "url": job.get('apply_url', '#'),
                "timestamp": job.get('date', '')
            }
            
            bounties.append(bounty)
            
        print(f"✅ HEADHUNTER: {len(bounties)} High-Value Targets Acquired.")
        return bounties

    except Exception as e:
        print(f"❌ HEADHUNTER FAILED: {e}")
        # Return a fallback "Ghost Bounty" if API fails so UI isn't empty
        return [{
            "id": "ERR-001",
            "client": "SYSTEM FAILURE",
            "task": "RECONNECT NEURAL LINK",
            "description": "Remote uplink failed. Manual override required.",
            "reward": ".00",
            "difficulty": "NOVICE",
            "type": "DEV",
            "status": "TAKEN",
            "url": "#"
        }]

if __name__ == "__main__":
    # Test run
    results = hunt_bounties()
    for r in results:
        print(f"[{r['difficulty']}] {r['task']} - {r['reward']}")

import { useState, useEffect } from 'react';
import { Target, Terminal, Shield, PlusCircle, ExternalLink, Activity, Briefcase, DollarSign, Clock, CheckCircle, Flame, Skull, Ghost, Zap, Wifi } from 'lucide-react';

// --- DATA STRUCTURES ---
interface Bounty {
  id: string;
  client: string;
  task: string;
  description: string;
  reward: string;
  difficulty: 'NOVICE' | 'VETERAN' | 'LETHAL';
  type: 'RECON' | 'DEV' | 'DESIGN' | 'MARKETING';
  status: 'OPEN' | 'TAKEN';
  url: string;
}

// 1. FALLBACK STATIC DATA (Simulation Mode)
// If the backend sleeps, we show this.
const STATIC_BOUNTIES: Bounty[] = [
    { 
        id: 'CR-001', 
        client: 'ONYX SYSTEMS', 
        task: 'PENETRATION TEST: v2.0 API', 
        description: 'TARGET: User Auth Protocol. OBJECTIVE: Bypass MFA. REQUIRES: Python, Burp Suite.', 
        reward: ',500.00 USDC', 
        difficulty: 'LETHAL', 
        type: 'DEV', 
        status: 'OPEN',
        url: '#' 
    },
    { 
        id: 'CR-002', 
        client: 'STEALTH FINTECH', 
        task: 'DATA HARVEST: CTO EMAILS', 
        description: 'TARGET: 50x Series A Startups. OBJECTIVE: Extract Lead List. REQUIRES: OSINT, Scrapers.', 
        reward: '.00', 
        difficulty: 'VETERAN', 
        type: 'RECON', 
        status: 'OPEN',
        url: '#' 
    },
    { 
        id: 'CR-003', 
        client: 'REDACTED PROTOCOL', 
        task: 'UI OVERHAUL: DARK MODE', 
        description: 'TARGET: Dashboard. OBJECTIVE: "High-Contrast Terminal" aesthetic. REQUIRES: Tailwind, React.', 
        reward: '.00', 
        difficulty: 'VETERAN', 
        type: 'DESIGN', 
        status: 'OPEN',
        url: '#' 
    },
    { 
        id: 'CR-004', 
        client: 'UNKNOWN SYNDICATE', 
        task: 'VIRAL ENGAGEMENT BOT', 
        description: 'TARGET: Twitter/X. OBJECTIVE: Auto-reply to crypto influencers. REQUIRES: GPT-4, Automation.', 
        reward: ',200.00', 
        difficulty: 'LETHAL', 
        type: 'DEV', 
        status: 'OPEN',
        url: '#' 
    },
    { 
        id: 'CR-005', 
        client: 'AVALON CORP', 
        task: 'COPYWRITING: LANDING PAGE', 
        description: 'TARGET: Sales Funnel. OBJECTIVE: Increment conversion by 2%. REQUIRES: Psychology, English.', 
        reward: '.00', 
        difficulty: 'NOVICE', 
        type: 'MARKETING', 
        status: 'OPEN',
        url: '#' 
    }
];

function App() {
  const [bounties, setBounties] = useState<Bounty[]>(STATIC_BOUNTIES);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('OFFLINE / SIMULATION');

  // !!! REPLACE THIS WITH YOUR NEW RAILWAY URL IF IT CHANGED !!!
  const API_URL = 'https://web-production-b9691.up.railway.app';
  const STRIPE_POST_LINK = "https://buy.stripe.com/7sYfZgdJP9Kdd4i95v1Fe08"; 

  // 2. HYBRID FETCHING LOGIC
  useEffect(() => {
      fetchLiveBounties();
  }, []);

  const fetchLiveBounties = async () => {
      setLoading(true);
      try {
          console.log(📡 CONNECTING TO: );
          // 1. Try to fetch from backend
          const response = await fetch(${API_URL}/latest_deals.json);
          if (!response.ok) throw new Error('Network response was not ok');
          
          const data = await response.json();
          
          if (Array.isArray(data) && data.length > 0) {
              setBounties(data);
              setConnectionStatus('CONNECTED // LIVE FEED');
          } else {
              // Backend is empty? Use static.
              setConnectionStatus('CONNECTED // NO SIGNALS (USING SIMULATION)');
          }
      } catch (error) {
          console.warn("⚠️ BACKEND SILENT. USING FALLBACK PROTOCOL.", error);
          setConnectionStatus('BACKEND OFFLINE // SIMULATION MODE');
          // Shuffle static data so it feels fresh
          setBounties([...STATIC_BOUNTIES].sort(() => Math.random() - 0.5));
      } finally {
          setLoading(false);
      }
  };

  const refreshFeed = () => {
      fetchLiveBounties();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-emerald-400 font-mono p-4 selection:bg-emerald-900 selection:text-white pb-24">
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_4px,3px_100%]"></div>

      {/* HEADER */}
      <nav className="max-w-4xl mx-auto mb-12 flex justify-between items-center border-b border-emerald-900/50 pb-6 pt-4 relative z-10 transition-all duration-500 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-900/10 rounded flex items-center justify-center border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                <Ghost size={24} className="text-emerald-400" />
            </div>
            <div>
                <h1 className="font-black text-2xl tracking-widest text-white">CYBERHOUND</h1>
                <p className="text-[10px] text-emerald-600 font-bold tracking-[0.4em]">MERCENARY NETWORK // v3.5</p>
            </div>
          </div>
          
          <a  
            href={STRIPE_POST_LINK}
            target="_blank"
            rel="noreferrer"
            className="hidden md:flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded font-bold shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:scale-105 transition-all text-xs tracking-widest"
          >
              <PlusCircle size={16} /> POST BOUNTY ()
          </a>
      </nav>

      {/* BOUNTY GRID */}
      <main className="max-w-4xl mx-auto relative z-10">
          
          {/* STATS BAR */}
          <div className="flex justify-between items-end mb-6 text-xs text-emerald-700 font-bold">
              <div className="flex gap-6">
                 <span className={lex items-center gap-2 transition-colors }>
                    <Activity size={14} className={loading ? "animate-spin" : "animate-pulse"} /> {loading ? 'SCANNING...' : connectionStatus}
                 </span>
                 <span className="flex items-center gap-2 mobile-hide"><Briefcase size={14} /> {bounties.length} CONTRACTS</span>
              </div>
              <button onClick={refreshFeed} disabled={loading} className="flex items-center gap-2 hover:text-emerald-400 transition-colors group disabled:opacity-50">
                  <span className="group-hover:animate-spin"><Zap size={12} /></span> REFRESH SIGNALS
              </button>
          </div>

          <div className={space-y-4 transition-all duration-300 }>
              
              {/* BOUNTY CARD MAPPING */}
              {bounties.map((bounty) => (
                  <div key={bounty.id} className="group relative bg-neutral-900/80 border border-emerald-900/50 hover:border-emerald-500 transition-all rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] animate-in fade-in slide-in-from-bottom-2">
                      
                      {/* Left: Info */}
                      <div className="flex items-start gap-4 flex-grow">
                           {/* Icon Box */}
                           <div className={w-12 h-12 shrink-0 rounded flex items-center justify-center border bg-black shadow-lg }>
                               {bounty.difficulty === 'LETHAL' ? <Skull size={20} /> : 
                                bounty.difficulty === 'VETERAN' ? <Target size={20} /> :
                                <Terminal size={20} />}
                           </div>

                           <div className="w-full">
                               <div className="flex flex-wrap items-center gap-3 mb-1">
                                   <h3 className="font-bold text-lg text-white group-hover:text-emerald-300 transition-colors tracking-tight line-clamp-1">{bounty.task}</h3>
                                   <span className={	ext-[9px] px-2 py-0.5 rounded border tracking-wider font-bold }>{bounty.difficulty}</span>
                               </div>
                               <p className="text-sm text-gray-400 mb-2 font-medium line-clamp-2 md:line-clamp-1">{bounty.description}</p>
                               <div className="flex items-center gap-4 text-[10px] font-bold text-emerald-800">
                                   <span className="flex items-center gap-1"><Shield size={10} /> {bounty.client}</span>
                                   <span className="flex items-center gap-1"><Clock size={10} /> {(Math.random() * 10).toFixed(0)}H AGO</span>
                               </div>
                           </div>
                      </div>

                      {/* Right: Reward & Action */}
                      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-emerald-900/30 pt-4 md:pt-0 shrink-0">
                          <div className="text-right">
                              <p className="text-[9px] text-gray-600 mb-0.5 tracking-widest uppercase">BOUNTY</p>
                              <p className="text-xl font-black text-white flex items-center gap-1 justify-end tracking-tighter shadow-black drop-shadow-md">
                                  {bounty.reward}
                              </p>
                          </div>
                          
                          <a href={bounty.url || STRIPE_POST_LINK} target="_blank" rel="noreferrer" className="bg-emerald-900/10 hover:bg-emerald-500 hover:text-black border border-emerald-500/50 text-emerald-500 px-5 py-3 rounded font-black text-[10px] tracking-[0.2em] transition-all flex items-center gap-2 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                              ACCEPT <ExternalLink size={12} />
                          </a>
                      </div>

                  </div>
              ))}

              {/* EMPTY STATE / CTA */}
              <div className="bg-neutral-900/50 border border-dashed border-neutral-800 rounded-lg p-12 text-center mt-8">
                  <p className="text-gray-600 mb-4 font-mono text-xs">END OF FEED</p>
                  <p className="text-emerald-600 text-sm mb-6 font-bold">Have a job that needs doing? Tap into the network.</p>
                  <a href={STRIPE_POST_LINK} className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 font-bold border-b-2 border-yellow-500/50 hover:border-yellow-500 pb-0.5 text-xs tracking-widest uppercase transition-all">
                      POST A PRIORITY CONTRACT <ExternalLink size={10}/>
                  </a>
              </div>

          </div>

      </main>
      
      {/* MOBILE FAB FOR POSTING */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
          <a href={STRIPE_POST_LINK} className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center text-black shadow-[0_0_20px_rgba(234,179,8,0.5)] border-2 border-yellow-400">
              <PlusCircle size={28} />
          </a>
      </div>
      
      <footer className="fixed bottom-0 left-0 right-0 py-2 text-center text-[9px] text-emerald-900 z-0 pointer-events-none flex justify-center items-center gap-2">
          <Wifi size={10} className={connectionStatus.includes('OFFLINE') ? 'text-red-900' : 'text-emerald-900'} /> 
          SECURE CONNECTION // CYBERHOUND OS
      </footer>

    </div>
  );
}

export default App;

import { useState, useEffect } from 'react';
import { Target, Shield, PlusCircle, ExternalLink, Activity, Briefcase, Clock, Skull, Zap, Wifi, Search, MapPin, ChevronRight, AlertTriangle } from 'lucide-react';

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

// 1. FALLBACK STATIC DATA
const STATIC_BOUNTIES: Bounty[] = [
    { 
        id: 'B-001', 
        client: 'ONYX SYSTEMS', 
        task: 'PENETRATION TEST: v2.0 API', 
        description: 'TARGET: User Auth Protocol. OBJECTIVE: Bypass MFA. REQUIRES: Python, Burp Suite.', 
        reward: '$2,500.00 USDC', 
        difficulty: 'LETHAL', 
        type: 'DEV', 
        status: 'OPEN',
        url: '#' 
    },
    { 
        id: 'B-002', 
        client: 'STEALTH FINTECH', 
        task: 'DATA HARVEST: CTO EMAILS', 
        description: 'TARGET: 50x Series A Startups. OBJECTIVE: Extract Lead List. REQUIRES: OSINT, Scrapers.', 
        reward: '$450.00', 
        difficulty: 'VETERAN', 
        type: 'RECON', 
        status: 'OPEN',
        url: '#' 
    },
    { 
        id: 'B-003', 
        client: 'REDACTED PROTOCOL', 
        task: 'UI OVERHAUL: DARK MODE', 
        description: 'TARGET: Dashboard. OBJECTIVE: "High-Contrast Terminal" aesthetic. REQUIRES: Tailwind, React.', 
        reward: '$800.00', 
        difficulty: 'VETERAN', 
        type: 'DESIGN', 
        status: 'OPEN',
        url: '#' 
    },
    { 
        id: 'B-004', 
        client: 'UNKNOWN SYNDICATE', 
        task: 'VIRAL ENGAGEMENT BOT', 
        description: 'TARGET: Twitter/X. OBJECTIVE: Auto-reply to crypto influencers. REQUIRES: GPT-4, Automation.', 
        reward: '$1,200.00', 
        difficulty: 'LETHAL', 
        type: 'DEV', 
        status: 'OPEN',
        url: '#' 
    },
    { 
        id: 'B-005', 
        client: 'AVALON CORP', 
        task: 'COPYWRITING: LANDING PAGE', 
        description: 'TARGET: Sales Funnel. OBJECTIVE: Increment conversion by 2%. REQUIRES: Psychology, English.', 
        reward: '$150.00', 
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

  const API_URL = 'https://web-production-b9691.up.railway.app';
  const STRIPE_POST_LINK = "https://buy.stripe.com/7sYfZgdJP9Kdd4i95v1Fe08"; 

  // 2. HYBRID FETCHING LOGIC
  useEffect(() => {
    const fetchLiveBounties = async () => {
        setLoading(true);
        try {
            console.log(`📡 CONNECTING TO: ${API_URL}`);
            const response = await fetch(`${API_URL}/latest_deals.json`);
            if (!response.ok) throw new Error('Network response was not ok');
            
            const data = await response.json();
            
            if (Array.isArray(data) && data.length > 0) {
                setBounties(data);
                setConnectionStatus('CONNECTED // LIVE FEED');
            } else {
                setConnectionStatus('CONNECTED // NO SIGNALS (USING SIMULATION)');
            }
        } catch (error) {
            console.warn("⚠️ BACKEND SILENT. USING FALLBACK PROTOCOL.", error);
            setConnectionStatus('BACKEND OFFLINE // SIMULATION MODE');
            setBounties([...STATIC_BOUNTIES].sort(() => Math.random() - 0.5));
        } finally {
            setLoading(false);
        }
    };
    fetchLiveBounties();
  }, []);

  const refreshFeed = () => {
      setLoading(true);
      setTimeout(() => {
          setBounties([...STATIC_BOUNTIES].sort(() => Math.random() - 0.5));
          setLoading(false);
      }, 700);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 font-sans p-4 selection:bg-emerald-500 selection:text-white pb-32">
      
      {/* Background Texture */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px]"></div>

      {/* HEADER */}
      <nav className="max-w-6xl mx-auto mb-10 mt-4 flex justify-between items-center bg-slate-800/80 backdrop-blur-md p-4 rounded-xl border border-slate-700 shadow-xl sticky top-4 z-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <Target size={28} className="text-white" />
            </div>
            <div>
                <h1 className="font-black text-2xl tracking-tight text-white leading-none">BOUNTY</h1>
                <p className="text-[11px] text-emerald-400 font-bold tracking-widest uppercase mt-1">Global Work Protocol</p>
            </div>
          </div>
          
          <a  
            href={STRIPE_POST_LINK}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-white hover:bg-emerald-50 text-slate-900 px-6 py-3 rounded-lg font-bold shadow-lg shadow-white/10 hover:shadow-xl hover:scale-[1.02] transition-all text-sm"
          >
              <PlusCircle size={18} className="text-emerald-600" /> 
              <span className="hidden md:inline">POST BOUNTY</span>
              <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded text-[10px] ml-1">$29</span>
          </a>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-6xl mx-auto relative z-10 px-2">
          
          {/* STATS & FILTERS */}
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-8 gap-4 bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
              <div className="flex flex-wrap gap-6 text-sm font-medium">
                 <span className={`flex items-center gap-2 transition-colors ${loading ? 'text-emerald-400' : 'text-slate-400'}`}>
                    <div className={`w-2 h-2 rounded-full ${loading ? "bg-emerald-400 animate-ping" : "bg-emerald-500"}`}></div>
                    {loading ? 'SCANNING NETWORK...' : connectionStatus}
                 </span>
                 <span className="flex items-center gap-2 text-slate-300"><Briefcase size={16} className="text-slate-500" /> {bounties.length} ACTIVE CONTRACTS</span>
              </div>
              
              <button onClick={refreshFeed} disabled={loading} className="flex items-center gap-2 text-emerald-400 hover:text-white transition-colors text-sm font-bold bg-slate-900/50 px-4 py-2 rounded border border-slate-900 hover:border-emerald-500/50 hover:bg-emerald-500/10 active:scale-95 disabled:opacity-50">
                  <span className={loading ? "animate-spin" : ""}><Zap size={14} /></span> REFRESH FEED
              </button>
          </div>

          <div className={`grid grid-cols-1 gap-4 transition-all duration-300 ${loading ? 'opacity-80' : 'opacity-100'}`}>
              
              {/* BOUNTY CARD MAPPING */}
              {bounties.map((bounty) => (
                  <div key={bounty.id} className="group relative bg-slate-800 border-l-4 border-l-transparent hover:border-l-emerald-500 border-y border-r border-slate-700 hover:bg-slate-750 transition-all rounded-r-lg p-6 shadow-lg hover:shadow-xl animate-in fade-in slide-in-from-bottom-4">
                      
                      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                           
                           {/* Details */}
                           <div className="flex-grow space-y-3">
                               <div className="flex flex-wrap items-center gap-3">
                                   <span className={`px-2 py-1 rounded text-[10px] font-black tracking-wider uppercase border ${
                                       bounty.difficulty === 'LETHAL' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                       bounty.difficulty === 'VETERAN' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                       'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                   }`}>
                                       {bounty.difficulty}
                                   </span>
                                   <span className="text-xs text-slate-500 font-mono">#{bounty.id}</span>
                               </div>
                               
                               <h3 className="font-bold text-xl text-white group-hover:text-emerald-400 transition-colors">{bounty.task}</h3>
                               
                               <p className="text-slate-400 leading-relaxed max-w-2xl">{bounty.description}</p>
                               
                               <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-500 pt-2">
                                   <span className="flex items-center gap-2 text-slate-400"><Shield size={14} className="text-slate-600" /> {bounty.client}</span>
                                   <span className="flex items-center gap-2"><MapPin size={14} /> REMOTE</span>
                                   <span className="flex items-center gap-2"><Clock size={14} /> POSTED {(Math.random() * 24).toFixed(0)}H AGO</span>
                               </div>
                           </div>

                           {/* Reward & Action */}
                           <div className="flex flex-row md:flex-col items-center md:items-end gap-4 w-full md:w-auto border-t md:border-t-0 border-slate-700 pt-4 md:pt-0 justify-between">
                               <div className="text-right">
                                   <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider mb-1">BOUNTY REWARD</p>
                                   <span className="text-2xl font-black text-white tracking-tight">{bounty.reward}</span>
                               </div>
                               
                               <a href={bounty.url || STRIPE_POST_LINK} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded font-bold text-sm shadow-lg shadow-emerald-900/20 transition-all hover:scale-105 active:scale-95 whitespace-nowrap">
                                   ACCEPT CONTRACT <ChevronRight size={16} />
                               </a>
                           </div>
                      </div>
                  </div>
              ))}

              {/* EMPTY STATE / CTA */}
              <div className="bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-xl p-12 text-center mt-8 hover:bg-slate-800/50 transition-colors">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
                    <Search size={32} className="text-slate-600" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">Seek and Destroy</h3>
                  <p className="text-slate-400 text-sm mb-8 max-w-md mx-auto">This feed is curated for high-value targets. Don't see a job that fits your skillset? Post your own bounty or check back later.</p>
                  <a href={STRIPE_POST_LINK} className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-bold uppercase tracking-widest text-xs border-b-2 border-emerald-500/20 hover:border-emerald-500 pb-1 transition-all">
                      Broadcast Signal <Wifi size={14}/>
                  </a>
              </div>

          </div>

      </main>
      
      {/* MOBILE FAB */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
          <a href={STRIPE_POST_LINK} className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-xl shadow-emerald-500/30 border-2 border-emerald-400">
              <PlusCircle size={32} />
          </a>
      </div>

    </div>
  );
}

export default App;

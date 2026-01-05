import { useState, useEffect } from 'react'
import { Activity, Globe, Crosshair, Terminal, Zap, Shield, Wifi, Lock, Mail, Radio, ShieldAlert, Smartphone } from 'lucide-react'
import MysteryTicker from './components/MysteryTicker';

// --- Types ---
interface Deal {
  id: number;
  brand: string;
  summary: string;
  value_score: number;
  discount_amount: number;
  duration_months: number;
  url?: string;
  image?: string;
  verdict?: string;
}

interface IntelResponse {
  mission: string;
  extracted_intel: {
    Brand: string;
    Data: Deal[];
  } | Deal[];
  target?: string;
}

// --- Status Badge Component ---
const StatusBadge = ({ label, status }: { label: string, status: 'online' | 'offline' | 'scanning' }) => {
  const colors = {
    online: 'bg-green-500/20 text-green-400 border-green-500/50',
    offline: 'bg-red-500/20 text-red-400 border-red-500/50',
    scanning: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50 animate-pulse'
  }
  
  return (
    <div className={px-2 py-1 rounded border  text-[10px] uppercase font-bold tracking-wider flex items-center gap-1.5}>
      <div className={w-1.5 h-1.5 rounded-full } />
      {label}
    </div>
  )
}

function App() {
  const [intel, setIntel] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [lastSniff, setLastSniff] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Dynamic Environment Handling
  const API_URL = import.meta.env.PROD 
    ? "https://web-production-b9691.up.railway.app" 
    : "http://127.0.0.1:5000";

  const addLog = (msg: string) => {
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
      setLogs(prev => [[] , ...prev].slice(0, 8)); // Keep last 8
  };

  useEffect(() => {
    fetchLatestIntel();
    const bootSequence = [
        "Initializing Cyberhound Kernel...",
        "Connecting to Neural Net...",
        "Loading Pattern Recognition Modules...",
        "System Online. Listening for signals."
    ];
    let delay = 0;
    bootSequence.forEach(msg => {
        setTimeout(() => addLog(msg), delay);
        delay += 800;
    });
  }, []);

  const fetchLatestIntel = async () => {
    try {
      const response = await fetch(${API_URL}/latest_deals.json);
      if (!response.ok) throw new Error("Feed Offline");
      const data = await response.json();
      // Handle both direct array and wrapped object formats
      const deals = Array.isArray(data) ? data : (data.extracted_intel || []); 
      const parsedDeals = Array.isArray(deals) ? deals : (deals.Data || []);
      setIntel(parsedDeals);
    } catch (e) {
      console.error(e);
      addLog("ERROR: Feed Connection Lost. Retrying...");
    } finally {
        setLoading(false);
    }
  };

  const handleTestSniff = async (target: string = "appsumo") => {
      setScanning(true);
      addLog(>>> INITIATING SCAN: TARGET []);
      
      try {
          const response = await fetch(${API_URL}/api/scan?target=, {
              method: "POST"
          });
          const data = await response.json();
          
          if (data.status === "SUCCESS") {
              addLog(>>> CONTACT CONFIRMED:  SIGNALS);
              setLastSniff(new Date().toLocaleTimeString());
              // Refresh the feed to show new data
              if (data.intel) setIntel(data.intel);
          } else {
              addLog(">>> SCAN FAILED: NO SIGNAL");
          }
      } catch (e) {
          addLog(">>> FATAL: SCANNER MALFUNCTION");
      } finally {
          setScanning(false);
      }
    };

  const triggerPaywall = () => { 
        window.open("https://buy.stripe.com/7sYfZgdJP9Kdd4i95v1Fe08", "_blank"); 
    };

    return (
      <div className="min-h-screen bg-cyber-black text-cyber-green font-mono overflow-hidden relative flex flex-col">
          {/* BACKGROUND GRID */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,136,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,136,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
          
          {/* HEADER */}
          <header className="border-b border-cyber-neon/30 bg-black/80 backdrop-blur p-4 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className="flex items-center gap-4">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-cyber-neon/20 rounded-full blur-md group-hover:bg-cyber-neon/40 transition-all"></div>
                    <img src="/cyberhound_logo.jpg" alt="Cyberhound" className="w-14 h-14 rounded-full border-2 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.5)] relative z-10 object-cover" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black tracking-widest text-white flex items-center gap-2">
                        CYBERHOUND <span className="text-cyber-neon text-sm bg-cyber-neon/10 px-2 rounded border border-cyber-neon/20">V3.3</span>
                    </h1>
                    <p className="text-xs text-cyber-green/60 uppercase tracking-[0.3em]">Autonomous Deal Hunter</p>
                  </div>
              </div>

             <div className="flex items-center gap-3">
                 <button 
                      onClick={triggerPaywall}
                      className="hidden md:flex items-center gap-2 bg-yellow-600/10 hover:bg-yellow-600/20 text-yellow-500 border border-yellow-600/50 px-4 py-2 rounded transition-all text-xs font-bold tracking-wider hover:shadow-[0_0_15px_rgba(234,179,8,0.3)] group"
                 >
                      <Lock size={14} className="group-hover:animate-pulse" />
                      UNLOCK PRO
                 </button>
             </div>
            </div>
          </header>

          {/* MAIN DASHBOARD */}
          <main className="flex-grow p-4 md:p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
              
            {/* LEFT: SYSTEM STATUS & LOGS */}
            <aside className="lg:col-span-1 space-y-6">
                {/* STATUS BAR */}
                <div className="bg-black/40 border border-cyber-neon/20 p-4 rounded backdrop-blur-sm">
                    <h2 className="text-white/50 text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Activity size={12} /> System Status
                    </h2>
                    <div className="space-y-3">
                        <StatusBadge label="NET_LINK" status={loading ? "offline" : "online"} />
                        <StatusBadge label="SCANNER" status={scanning ? "scanning" : "online"} />
                        <StatusBadge label="AI_CORE" status="online" />
                    </div>
                </div>

                {/* TERMINAL */}
                <div className="bg-black/80 border border-cyber-neon/30 p-4 rounded font-mono text-xs h-64 overflow-hidden relative font-terminal">
                    <div className="absolute top-0 left-0 right-0 bg-cyber-neon/10 p-1 text-center text-[10px] text-cyber-neon font-bold border-b border-cyber-neon/20">
                        TERMINAL OUTPUT
                    </div>
                    <div className="mt-6 flex flex-col space-y-1 h-full justify-end pb-2">
                        {logs.map((log, i) => (
                            <div key={i} className="opacity-80 hover:opacity-100 transition-opacity border-l-2 border-transparent hover:border-cyber-neon pl-2">
                                <span className="text-cyber-neon/50 mr-2">{'>'}</span>{log}
                            </div>
                        ))}
                    </div>
                    {/* Scan Trigger */}
                    <button 
                        onClick={() => handleTestSniff("appsumo")}
                        disabled={scanning}
                        className="w-full mt-2 bg-cyber-neon/10 hover:bg-cyber-neon/20 border border-cyber-neon text-cyber-neon py-2 rounded uppercase font-bold tracking-wider hover:shadow-[0_0_10px_rgba(34,197,94,0.3)] disabled:opacity-50 transition-all flex justify-center items-center gap-2"
                    >
                        {scanning ? <span className="animate-spin">✇</span> : <Crosshair size={14} />}
                        {scanning ? "SCANNING SECTOR..." : "INITIATE SCAN"}
                    </button>
                </div>
            </aside>

            {/* RIGHT: INTEL FEED (VISUAL UPGRADE) */}
            <section className="lg:col-span-3 flex flex-col h-full">
               <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-2">
                   <div>
                       <h2 className="text-xl text-white font-black tracking-widest flex items-center gap-2">
                           <Globe className="text-cyber-neon" size={20} /> LIVE INTERCEPTS
                       </h2>
                       <p className="text-xs text-white/40 mt-1">
                           SECTOR: GLOBAL // TARGET: LIFETIME DEALS
                       </p>
                   </div>
                   <div className="flex items-center gap-2">
                       <span className="text-xs text-cyber-neon animate-pulse">● LIVE</span>
                       <span className="text-[10px] text-white/30 border border-white/10 px-2 py-1 rounded">
                           COUNT: {intel.length}
                       </span>
                   </div>
               </div>
               
               <div className="flex-grow relative min-h-[500px]">
                   <MysteryTicker />

                   {lastSniff && (
                       <div className="mb-4 border border-cyber-neon bg-cyber-neon/10 p-3 rounded animate-in fade-in slide-in-from-right duration-500 flex items-center gap-3">
                              <Zap className="w-5 h-5 text-cyber-neon animate-pulse" /> 
                              <div>
                                  <h3 className="text-cyber-neon font-bold text-sm">NEW SIGNALS DETECTED</h3>
                                  <p className="text-[10px] text-white/70">Analysis complete. Grid updated.</p>
                              </div>
                       </div>
                   )}
                   
                   {/* SCROLLABLE GRID CONTAINER */}
                   <div className="absolute inset-0 overflow-y-auto pr-2 space-y-4 pb-20">
                      {intel.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-white/30 space-y-4">
                            <Wifi size={48} className="animate-pulse opacity-50" />
                            <div className="text-sm tracking-widest">SEARCHING FREQUENCIES...</div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {intel.map((deal) => (
                                <a 
                                    key={deal.id} 
                                    href={deal.url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="group relative bg-black/60 rounded-lg border border-white/10 hover:border-cyber-neon/50 transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] overflow-hidden flex flex-col"
                                >
                                    {/* IMAGE AREA */}
                                    <div className="h-40 bg-gray-900 relative overflow-hidden">
                                        {deal.image ? (
                                            <img src={deal.image} alt={deal.brand} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-cyber-dim/20">
                                                <Terminal size={32} className="text-white/20" />
                                            </div>
                                        )}
                                        {/* OVERLAY GRADIENT */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                                        
                                        {/* BADGES */}
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            <span className="bg-black/80 backdrop-blur text-cyber-neon border border-cyber-neon/30 text-[10px] font-bold px-2 py-1 rounded">
                                                {deal.value_score}% MATCH
                                            </span>
                                        </div>
                                        <div className="absolute bottom-2 left-3">
                                            <h3 className="text-white font-black text-lg tracking-wide drop-shadow-md group-hover:text-cyber-neon transition-colors">
                                                {deal.brand}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* CONTENT AREA */}
                                    <div className="p-4 flex-grow flex flex-col justify-between">
                                        <p className="text-white/70 text-sm line-clamp-2 mb-3 font-sans">
                                            {deal.summary.replace("Lifetime Deal spotted:", "")}
                                        </p>
                                        
                                        <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-auto">
                                            <div className="flex items-center gap-2 text-xs text-white/40">
                                                <Shield size={12} />
                                                <span>VERIFIED</span>
                                            </div>
                                            <div className="text-cyber-green text-xs font-bold uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                                                ACQUIRE TARGET <span className="text-[10px]">→</span>
                                            </div>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                      )}
                   </div>
               </div>
            </section>
          </main>

          {/* APP-LIKE FOOTER (MOBILE) */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur border-t border-white/10 p-3 flex justify-around items-center z-50 text-[10px] text-white/50">
                <div className="flex flex-col items-center gap-1 text-cyber-neon">
                    <Radio size={18} />
                    <span>FEED</span>
                </div>
                <div className="flex flex-col items-center gap-1" onClick={() => handleTestSniff("appsumo")}>
                    <Crosshair size={18} />
                    <span>SCAN</span>
                </div>
                <div className="flex flex-col items-center gap-1" onClick={triggerPaywall}>
                    <Lock size={18} />
                    <span>PRO</span>
                </div>
          </div>

          <footer className="border-t border-white/10 p-6 bg-black text-center relative z-10 hidden md:block">
            <div className="flex justify-center gap-8 mb-4">
                <button onClick={triggerPaywall} className="text-white/40 hover:text-cyber-neon transition-colors text-xs flex items-center gap-2">
                    <ShieldAlert size={14} /> SECURITY AUDIT
                </button>
                <div className="h-4 w-px bg-white/10"></div>
                <a href="mailto:ops@cyberhound.io" className="text-white/40 hover:text-cyber-neon transition-colors text-xs flex items-center gap-2">
                    <Mail size={14} /> ENCRYPTED COMM
                </a>
            </div>
            <p className="text-[10px] text-white/20 uppercase tracking-[0.5em]">
                Cyberhound Systems © 2026 // ALL RIGHTS RESERVED
            </p>
          </footer>
      </div>
    )
}

export default App

import { useState, useEffect } from 'react'
import { Activity, Radio, Globe, Crosshair, Terminal, Zap, Shield, Wifi } from 'lucide-react'

// --- Types ---
interface Deal {
  id: number;
  brand: string;
  summary: string;
  value_score: number;
  discount_amount: number;
  duration_months: number;
  url?: string;
  verdict?: string;
}

interface IntelResponse {
  mission: string;
  extracted_intel: {
    Brand: string;
    Discount_Summary: string;
    Trial_Period: string;
    Verdict: string;
  }
}

// --- Status Components ---
const StatusBadge = ({ label, status }: { label: string, status: 'online' | 'offline' | 'busy' }) => (
  <div className="flex items-center space-x-2 border border-cyber-dim bg-cyber-black/50 px-3 py-1 rounded">
    <div className={`w-2 h-2 rounded-full ${status === 'online' ? 'bg-cyber-neon animate-pulse' : 'bg-cyber-alert'}`} />
    <span className="text-xs uppercase text-cyber-green font-mono tracking-widest">{label}</span>
    <span className="text-xs text-white/50">[{status.toUpperCase()}]</span>
  </div>
);

function App() {
  const [intel, setIntel] = useState<Deal[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [scanning, setScanning] = useState(false);
  const [lastSniff, setLastSniff] = useState<IntelResponse | null>(null);

  // Poll for "Latest Deals" (The Hot List)
  useEffect(() => {
    const fetchIntel = async () => {
      try {
        // In local dev, use localhost:5000. In prod, use window.location.origin or env var
        const apiUrl = import.meta.env.PROD
          ? 'https://web-production-b9691.up.railway.app'
          : 'http://localhost:5000';

        const res = await fetch(`${apiUrl}/api/intel`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setIntel(data);
        }
      } catch (e) {
        console.error("Link Failure:", e);
      }
    };

    fetchIntel();
    const interval = setInterval(fetchIntel, 5000);
    return () => clearInterval(interval);
  }, []);

  // "Test Sniff" Action - Trigger the Brain directly
  const handleTestSniff = async () => {
    setScanning(true);
    addLog("Initiating Deal Sniff Protocol...");

    try {
      const apiUrl = import.meta.env.PROD
        ? 'https://web-production-b9691.up.railway.app'
        : 'http://localhost:5000';

      const res = await fetch(`${apiUrl}/api/test_sniff`);
      const data = await res.json();

      setLastSniff(data);
      addLog(`Sniff Complete. Verdict: ${data.extracted_intel?.Verdict || 'Unknown'}`);
    } catch (e) {
      console.error(e); // Log internal error
      addLog("Critical Failure on Sniff Attempt.");
    } finally {
      setScanning(false);
    }
  };

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
  };

  return (
    <div className="min-h-screen bg-cyber-black text-cyber-green font-mono overflow-hidden relative">

      {/* Background Grid & FX */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(rgba(0, 255, 65, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 255, 65, 0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black z-0 pointer-events-none" />

      {/* --- HEADER: COLONY OS --- */}
      <header className="relative z-10 border-b border-cyber-dim bg-cyber-black/80 backdrop-blur-sm p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="p-2 border border-cyber-neon rounded-full">
            <Radio className="w-6 h-6 text-cyber-neon animate-pulse-slow" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-[0.2em] text-white">CYBERHOUND <span className="text-cyber-neon">V3.1</span></h1>
            <p className="text-xs text-cyber-green/60">AUTONOMOUS INTEL UNIT // COLONY OS</p>
          </div>
        </div>

        <div className="flex space-x-4">
          <StatusBadge label="NOSE" status="online" />
          <StatusBadge label="BRAIN" status="online" />
          <StatusBadge label="LINK" status={scanning ? 'busy' : 'online'} />
        </div>
      </header>

      {/* --- MAIN DASHBOARD LAYOUT --- */}
      <main className="relative z-10 p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-80px)]">

        {/* LEFT: HOUND STATUS & CONTROLS */}
        <section className="lg:col-span-3 space-y-6 flex flex-col">
          <div className="border border-cyber-dim bg-cyber-dark/80 p-4 rounded flex-grow relative overflow-hidden group">
            {/* Holographic Decoration */}
            <div className="absolute top-0 left-0 w-full h-1 bg-cyber-neon/50 shadow-[0_0_10px_#00ff41]" />

            <h2 className="text-sm uppercase tracking-widest text-white mb-4 flex items-center">
              <Shield className="w-4 h-4 mr-2" /> Active Operations
            </h2>

            <div className="space-y-4">
              <div className="bg-cyber-black/50 p-3 rounded border border-cyber-dim">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-white">Adobe Cloud</span>
                  <span className="text-cyber-alert text-xs animate-pulse">HUNTING</span>
                </div>
                <div className="w-full bg-cyber-dim h-1 mt-2">
                  <div className="bg-cyber-neon h-1 w-[70%] animate-scan" />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleTestSniff}
                disabled={scanning}
                className="w-full py-4 border border-cyber-neon text-cyber-neon hover:bg-cyber-neon hover:text-black transition-all font-bold tracking-widest flex justify-center items-center group-hover:shadow-[0_0_20px_rgba(0,255,65,0.3)]">
                {scanning ? <Activity className="animate-spin mr-2" /> : <Crosshair className="mr-2" />}
                {scanning ? 'INTERCEPTING...' : 'TRIGGER SNIFF PROTOCOL'}
              </button>
              <p className="text-[10px] text-center mt-2 text-cyber-green/50">AUTHORIZATION: COMMANDER NORTH</p>
            </div>
          </div>

          {/* LIVE TELEMETRY LOGS */}
          <div className="border border-cyber-dim bg-black p-4 rounded h-1/3 flex flex-col font-mono text-xs">
            <h3 className="text-cyber-dim uppercase mb-2 flex items-center"><Terminal className="w-3 h-3 mr-2" /> System Logs</h3>
            <div className="flex-grow overflow-y-auto space-y-1 scrollbar-hide">
              {logs.map((log, i) => (
                <div key={i} className="text-cyber-green/80 border-l-2 border-transparent hover:border-cyber-neon pl-2">
                  {log}
                </div>
              ))}
              {logs.length === 0 && <span className="text-white/20 italic">System Ready. Awaiting Input.</span>}
            </div>
          </div>
        </section>

        {/* CENTER: THE HOLOGRAPHIC MAP (Visualizer) */}
        <section className="lg:col-span-6 relative border border-cyber-dim bg-cyber-dark overflow-hidden rounded flex items-center justify-center">
          {/* Using Global Map SVG/Canvas would go here. For now, a CSS Radar Effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyber-dim/20 via-transparent to-black pointer-events-none" />

          {/* Radar Rings */}
          <div className="w-[400px] h-[400px] border border-cyber-neon/10 rounded-full absolute animate-[pulse_4s_infinite]" />
          <div className="w-[200px] h-[200px] border border-cyber-neon/20 rounded-full absolute" />
          <div className="w-[2px] h-full bg-cyber-neon/10 absolute animate-[spin_5s_linear_infinite]" />

          <div className="z-10 text-center">
            <Globe className="w-16 h-16 text-cyber-neon mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl text-white font-display tracking-widest">GLOBAL SCAN GRID</h2>
            <p className="text-cyber-green/60 uppercase text-xs mt-2">Monitoring 1,024 Nodes</p>
          </div>

          {/* Floating "Nodes" (CSS Only) */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyber-neon rounded-full animate-ping" />
          <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-cyber-alert rounded-full animate-ping delay-1000" />
        </section>

        {/* RIGHT: THE INTELLIGENCE FEED */}
        <section className="lg:col-span-3 flex flex-col space-y-4">
          {/* Latest Sniff Result (Gemini Output) */}
          {lastSniff && (
            <div className="border border-cyber-neon bg-cyber-neon/10 p-4 rounded animate-in fade-in slide-in-from-right duration-500">
              <h3 className="text-cyber-neon font-bold flex items-center mb-2">
                <Zap className="w-4 h-4 mr-2" /> INTERCEPT CONFIRMED
              </h3>
              <div className="text-sm space-y-2 text-white/90">
                <p><span className="text-cyber-green">TARGET:</span> {lastSniff.extracted_intel.Brand}</p>
                <p><span className="text-cyber-green">DEAL:</span> {lastSniff.extracted_intel.Discount_Summary}</p>
                <p><span className="text-cyber-green">VERDICT:</span> {lastSniff.extracted_intel.Verdict}</p>
              </div>
            </div>
          )}

          <div className="border border-cyber-dim bg-cyber-dark flex-grow overflow-hidden flex flex-col rounded">
            <div className="p-3 border-b border-cyber-dim bg-cyber-black flex justify-between">
              <span className="text-white text-xs uppercase">Recent Intercepts</span>
              <Wifi className="w-4 h-4 text-cyber-green" />
            </div>
            <div className="p-4 space-y-3 overflow-y-auto flex-grow">
              {intel.length === 0 ? (
                <div className="text-center text-white/30 text-xs py-10">NO DATA STREAM</div>
              ) : (
                intel.map((deal) => (
                  <div key={deal.id} className="bg-black/40 p-3 rounded border border-white/5 hover:border-cyber-green transition-colors cursor-pointer group">
                    <div className="flex justify-between items-start">
                      <span className="text-cyber-neon font-bold">{deal.brand}</span>
                      <span className="text-[10px] text-white/50">{deal.duration_months}MO</span>
                    </div>
                    <p className="text-white/80 text-xs mt-1 truncate">{deal.summary}</p>
                    <div className="mt-2 text-right">
                      <span className="text-[10px] bg-cyber-dim/50 px-2 py-1 rounded text-white group-hover:bg-cyber-neon group-hover:text-black">
                        SCORE: {deal.value_score}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;

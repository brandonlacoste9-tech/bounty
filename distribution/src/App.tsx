import { useState, useEffect } from 'react';
import { Scan, ShieldAlert, Zap, Terminal, Lock, Mail, Radio } from 'lucide-react';

interface Deal {
  id: string;
  title: string;
  price: string;
  discount: string;
  source: string;
  url: string;
  timestamp: string;
}

function App() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('IDLE');

  // CHANGE THIS TO YOUR RAILWAY BACKEND URL
  const API_URL = 'https://web-production-b9691.up.railway.app';

  const fetchDeals = async () => {
    setLoading(true);
    setStatus('ESTABLISHING NEURAL LINK...');
    try {
      const response = await fetch(`${API_URL}/deals`);
      const data = await response.json();
      setDeals(data);
      setStatus('TARGETS ACQUIRED');
    } catch (error) {
      console.error("Error fetching deals:", error);
      setStatus('CONNECTION ERROR - RETRYING');
    } finally {
      setLoading(false);
    }
  };

  const triggerScan = async () => {
    setLoading(true);
    setStatus('SCANNING SECTOR 7G...');
    try {
      const response = await fetch(`${API_URL}/scan`, { method: 'POST' });
      const data = await response.json();
      setStatus(`SCAN COMPLETE: ${data.deals_found} TARGETS FOUND`);
      fetchDeals(); // Refresh list after scan
    } catch (error) {
      console.error("Error triggering scan:", error);
      setStatus('SCAN FAILED');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-4 selection:bg-green-900 selection:text-white">
      {/* SCANLINE OVERLAY */}
      <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_4px,3px_100%]"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* HEADER & MONETIZATION */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-green-900 pb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-green-900/30 p-3 rounded-full border border-green-700 animate-pulse">
              <Scan size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-800">
                CYBERHOUND
              </h1>
              <p className="text-xs text-green-700 tracking-[0.3em]">AUTONOMOUS DEAL HUNTER V3.1</p>
            </div>
          </div>

          {/* NEW: MONETIZATION BUTTON */}
          <button 
            onClick={() => alert("STRIPE GATEWAY: INITIALIZING... (Integration Coming Soon)")}
            className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-black px-6 py-3 rounded font-bold transition-all shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:scale-105 border border-yellow-400"
          >
            <Lock size={18} />
            UNLOCK PRO INTEL
          </button>
        </header>

        {/* CONTROLS */}
        <div className="bg-green-900/10 border border-green-800 p-6 rounded-lg mb-8 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Terminal size={18} />
              <span className="text-sm opacity-75">SYSTEM STATUS:</span>
              <span className="font-bold text-green-400 animate-pulse">{status}</span>
            </div>
            <div className="text-xs text-green-800 border border-green-900 px-2 py-1 rounded">
              PING: 24ms
            </div>
          </div>
          
          <button 
            onClick={triggerScan}
            disabled={loading}
            className="w-full bg-green-700 hover:bg-green-600 text-black font-bold py-4 rounded flex justify-center items-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]"
          >
            {loading ? (
              <Zap className="animate-spin" />
            ) : (
              <Scan />
            )}
            {loading ? 'EXECUTING SNIFF PROTOCOL...' : 'TRIGGER MANUAL SCAN'}
          </button>
        </div>

        {/* RESULTS FEED */}
        <div className="grid gap-4">
          {deals.map((deal) => (
            <div key={deal.id} className="group border border-green-800 bg-black/50 p-4 rounded hover:bg-green-900/10 transition-all hover:border-green-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-green-900 text-xs px-2 py-1 text-green-300">
                {deal.source}
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-green-300">{deal.title}</h3>
                  <div className="flex gap-4 text-sm opacity-80">
                    <span className="line-through text-red-500/70">{deal.price}</span>
                    <span className="text-yellow-500 font-bold">{deal.discount}</span>
                  </div>
                </div>
                <a 
                  href={deal.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-green-900/50 hover:bg-green-500 hover:text-black p-2 rounded transition-colors"
                >
                  <ShieldAlert size={20} />
                </a>
              </div>
            </div>
          ))}
          
          {deals.length === 0 && !loading && (
            <div className="text-center py-12 border border-dashed border-green-900 rounded opacity-50">
              <p>NO TARGETS IN RANGE. INITIATE SCAN.</p>
            </div>
          )}
        </div>

        {/* NEW: FOOTER / CONTACT LINK */}
        <footer className="mt-20 border-t border-green-900/30 pt-8 pb-12 text-center">
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-6">
                <a href="mailto:intel@cyberhound.io" className="flex items-center gap-2 text-green-700 hover:text-green-400 transition-colors text-sm uppercase tracking-widest">
                    <Mail size={16} />
                    Encrypted Channel
                </a>
                <a href="#" className="flex items-center gap-2 text-green-700 hover:text-green-400 transition-colors text-sm uppercase tracking-widest">
                    <Radio size={16} />
                    Sponsor Signal
                </a>
            </div>
            <p className="text-green-900 text-xs font-mono">
                CYBERHOUND INDUSTRIES // EST 2025 // SECURE CONNECTION
            </p>
        </footer>
      </div>
    </div>
  );
}

export default App;

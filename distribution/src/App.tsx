import { useState, useEffect } from 'react';
import { Target, Terminal, Shield, PlusCircle, ExternalLink, Activity, Briefcase, DollarSign, Clock, CheckCircle, Flame } from 'lucide-react';

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

// 1. MOCK BOUNTIES (This is what visitors see)
const BOUNTIES: Bounty[] = [
    { 
        id: 'b-001', 
        client: 'Unknown Startup', 
        task: 'Stress Test: iOS Beta', 
        description: 'Crash our app. Report bugs. Get paid.', 
        reward: '.00 USDC', 
        difficulty: 'NOVICE', 
        type: 'QA', 
        status: 'OPEN',
        url: '#' 
    },
    { 
        id: 'b-002', 
        client: 'Stealth AI Corp', 
        task: 'Data Extraction: LinkedIn', 
        description: 'Find emails for 100 CTOs in Fintech.', 
        reward: '.00', 
        difficulty: 'VETERAN', 
        type: 'RECON', 
        status: 'OPEN',
        url: '#' 
    },
    { 
        id: 'b-003', 
        client: 'Redacted', 
        task: 'Logo Design: CyberPunk Style', 
        description: 'Need a vector logo for a security firm. Fast turnaround.', 
        reward: '.00', 
        difficulty: 'VETERAN', 
        type: 'DESIGN', 
        status: 'OPEN',
        url: '#' 
    },
    { 
        id: 'b-004', 
        client: 'Crypto Protocol', 
        task: 'Smart Contract Audit', 
        description: 'Review our staking contract for vulnerabilities.', 
        reward: ',500.00', 
        difficulty: 'LETHAL', 
        type: 'DEV', 
        status: 'OPEN',
        url: '#' 
    }
];

function App() {
  const [bounties, setBounties] = useState<Bounty[]>(BOUNTIES);
  const [loading, setLoading] = useState(false);

  // SIMULATE FILTERING/LOADING
  const refreshFeed = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  // POST A BOUNTY LINK (Stripe)
  const STRIPE_POST_LINK = "https://buy.stripe.com/7sYfZgdJP9Kdd4i95v1Fe08"; 

  return (
    <div className="min-h-screen bg-neutral-950 text-emerald-400 font-mono p-4 selection:bg-emerald-900 selection:text-white pb-24">
      
      {/* HEADER */}
      <nav className="max-w-4xl mx-auto mb-12 flex justify-between items-center border-b border-emerald-900/50 pb-6 pt-4">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-900/20 rounded flex items-center justify-center border border-emerald-500/50">
                <Target size={24} />
            </div>
            <div>
                <h1 className="font-black text-2xl tracking-widest text-white">THE BOUNTY BOARD</h1>
                <p className="text-[10px] text-emerald-600 font-bold tracking-[0.3em]">MERCENARY NETWORK V1.0</p>
            </div>
          </div>
          
          <a  
            href={STRIPE_POST_LINK}
            target="_blank"
            className="hidden md:flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded font-bold shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:scale-105 transition-all text-xs tracking-widest"
          >
              <PlusCircle size={16} /> POST BOUNTY ()
          </a>
      </nav>

      {/* BOUNTY GRID */}
      <main className="max-w-4xl mx-auto">
          
          {/* STATS BAR */}
          <div className="flex justify-between items-end mb-6 text-xs text-emerald-700 font-bold">
              <div className="flex gap-6">
                 <span className="flex items-center gap-2"><Activity size={14} className="animate-pulse" /> LIVE FEED</span>
                 <span className="flex items-center gap-2"><Briefcase size={14} /> {bounties.length} ACTIVE CONTRACTS</span>
              </div>
              <button onClick={refreshFeed} className="hover:text-emerald-400 transition-colors">[REFRESH SIGNALS]</button>
          </div>

          <div className={space-y-4 transition-opacity duration-300 }>
              
              {/* BOUNTY CARD */}
              {bounties.map((bounty) => (
                  <div key={bounty.id} className="group relative bg-neutral-900 border border-emerald-900/50 hover:border-emerald-500 transition-all rounded-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 overflow-hidden">
                      
                      {/* Left: Info */}
                      <div className="flex items-start gap-4">
                           {/* Icon Box */}
                           <div className={w-12 h-12 shrink-0 rounded flex items-center justify-center border bg-black }>
                               {bounty.difficulty === 'LETHAL' ? <Flame size={20} /> : <Terminal size={20} />}
                           </div>

                           <div>
                               <div className="flex items-center gap-3 mb-1">
                                   <h3 className="font-bold text-lg text-white group-hover:text-emerald-300 transition-colors">{bounty.task}</h3>
                                   <span className="text-[10px] bg-neutral-800 text-gray-400 px-2 py-0.5 rounded border border-gray-700">{bounty.difficulty}</span>
                               </div>
                               <p className="text-sm text-gray-400 mb-2">{bounty.description}</p>
                               <div className="flex items-center gap-4 text-[10px] font-bold text-emerald-700">
                                   <span className="flex items-center gap-1"><Shield size={10} /> {bounty.client}</span>
                                   <span className="flex items-center gap-1"><Clock size={10} /> 2H AGO</span>
                               </div>
                           </div>
                      </div>

                      {/* Right: Reward & Action */}
                      <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-emerald-900/30 pt-4 md:pt-0">
                          <div className="text-right">
                              <p className="text-[10px] text-gray-500 mb-0.5">BOUNTY REWARD</p>
                              <p className="text-xl font-black text-yellow-500 flex items-center gap-1 justify-end">
                                  {bounty.reward}
                              </p>
                          </div>
                          
                          <button className="bg-emerald-900/20 hover:bg-emerald-500 hover:text-black border border-emerald-500/50 text-emerald-500 px-4 py-3 rounded font-bold text-xs tracking-widest transition-all flex items-center gap-2">
                              ACCEPT <ExternalLink size={14} />
                          </button>
                      </div>

                  </div>
              ))}

              {/* EMPTY STATE / CTA */}
              <div className="bg-black/40 border border-dashed border-neutral-800 rounded-lg p-8 text-center mt-8">
                  <p className="text-gray-500 mb-4">END OF FEED</p>
                  <p className="text-emerald-600 text-sm mb-6">Need a task handling? Post a bounty and let the network solve it.</p>
                  <a href={STRIPE_POST_LINK} className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-400 font-bold border-b border-yellow-500 pb-0.5 text-xs tracking-widest">
                      INITIATE A CONTRACT +
                  </a>
              </div>

          </div>

      </main>
      
      {/* MOBILE FAB FOR POSTING */}
      <div className="md:hidden fixed bottom-6 right-6 z-50">
          <a href={STRIPE_POST_LINK} className="w-14 h-14 bg-yellow-500 rounded-full flex items-center justify-center text-black shadow-lg shadow-yellow-500/20">
              <PlusCircle size={24} />
          </a>
      </div>

    </div>
  );
}

export default App;

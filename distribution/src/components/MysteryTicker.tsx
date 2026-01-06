import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const MARKET_DATA = [
    { symbol: 'BTC', price: '64,231', change: '+2.4%', up: true },
    { symbol: 'ETH', price: '3,452', change: '+1.1%', up: true },
    { symbol: 'SOL', price: '145', change: '-0.5%', up: false },
    { symbol: 'USDC', price: '1.00', change: '0.0%', up: true },
    { symbol: 'NVDA', price: '892', change: '+4.2%', up: true },
];

export function MysteryTicker() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((prev) => (prev > 1000 ? 0 : prev + 1));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 border-t border-emerald-900/50 h-8 overflow-hidden z-40 flex items-center">
        <div className="flex gap-12 whitespace-nowrap animate-marquee px-4 w-full">
            {MARKET_DATA.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="text-emerald-600 font-bold">{item.symbol}</span>
                    <span className="text-gray-300">${item.price}</span>
                    <span className={`flex items-center ${item.up ? 'text-emerald-400' : 'text-red-400'}`}>
                        {item.up ? <TrendingUp size={10} className="mr-1"/> : <TrendingDown size={10} className="mr-1"/>}
                        {item.change}
                    </span>
                </div>
            ))}
             {/* Duplicate for seamless scroll effect */}
             {MARKET_DATA.map((item, i) => (
                <div key={`dup-${i}`} className="flex items-center gap-2 text-[10px] font-mono">
                    <span className="text-emerald-600 font-bold">{item.symbol}</span>
                    <span className="text-gray-300">${item.price}</span>
                    <span className={`flex items-center ${item.up ? 'text-emerald-400' : 'text-red-400'}`}>
                        {item.up ? <TrendingUp size={10} className="mr-1"/> : <TrendingDown size={10} className="mr-1"/>}
                        {item.change}
                    </span>
                </div>
            ))}
        </div>
    </div>
  );
}

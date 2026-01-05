import { Lock, Unlock, Zap, EyeOff } from 'lucide-react';

interface MysteryTickerProps {
    unlocked?: boolean;
    onUnlock?: () => void;
}

const MysteryTicker = ({ unlocked = false, onUnlock }: MysteryTickerProps) => {
    
    // MOCK DATA FOR THE MYSTERY BOX
    const SECRET_DEAL = {
        title: 'LIFETIME ACCESS: FLUTTERFLOW',
        price: 'FREE',
        real_price: '(Was /mo)',
        url: 'https://buy.stripe.com/7sYfZgdJP9Kdd4i95v1Fe08' // Stripe Link
    };

    const triggerPaywall = () => {
        if (onUnlock) {
            onUnlock();
        } else {
            window.open('https://buy.stripe.com/7sYfZgdJP9Kdd4i95v1Fe08', '_blank');
        }
    };

    return (
        <div className={elative overflow-hidden rounded-lg border transition-all duration-500 mb-4 p-4 }>
            
            {/* Header */}
            <div className='flex justify-between items-center mb-3'>
                <div className={lex items-center gap-2 }>
                    {unlocked ? <Unlock size={14} /> : <Zap size={14} className='animate-pulse' />}
                    <span className='text-[10px] font-bold tracking-[0.2em]'>{unlocked ? 'DECRYPTED INTEL' : 'CLASSIFIED SIGINT'}</span>
                </div>
                {!unlocked && (
                    <span className='bg-yellow-500/20 text-yellow-500 text-[9px] px-2 py-0.5 rounded animate-pulse'>
                        HIGH VALUE
                    </span>
                )}
            </div>

            {/* Content Container */}
            <div className='relative'>
                
                {/* LOCKED STATE */}
                {!unlocked && (
                    <div className='flex flex-col gap-2 relative z-10'>
                        <div className='flex items-center gap-2 opacity-50 blur-[2px] select-none'>
                             <div className='w-12 h-12 bg-yellow-700/50 rounded'></div>
                             <div className='flex flex-col gap-1 w-full'>
                                <div className='h-4 bg-yellow-700/50 rounded w-3/4'></div>
                                <div className='h-3 bg-yellow-700/30 rounded w-1/2'></div>
                             </div>
                        </div>
                        
                        <div className='absolute inset-0 flex items-center justify-center'>
                             <button 
                                onClick={triggerPaywall}
                                className='bg-black hover:bg-yellow-950 text-yellow-500 border border-yellow-600 px-4 py-2 rounded flex items-center gap-2 shadow-[0_0_20px_rgba(234,179,8,0.2)] hover:scale-105 transition-all'
                            >
                                <Lock size={14} />
                                <span className='font-bold text-[10px] tracking-widest'>DECRYPT DATA</span>
                            </button>
                        </div>
                    </div>
                )}
                
                {/* UNLOCKED STATE */}
                {unlocked && (
                    <div className='flex gap-4 items-start animate-in fade-in slide-in-from-bottom-2 duration-500'>
                         <div className='w-12 h-12 bg-green-900/50 border border-green-700 rounded flex items-center justify-center text-green-400'>
                            <EyeOff size={20} />
                         </div>
                         <div className='flex flex-col gap-1 w-full'>
                            <h3 className='font-bold text-green-100 text-sm leading-tight'>{SECRET_DEAL.title}</h3>
                            <div className='flex justify-between items-center'>
                                <span className='text-yellow-500 font-bold'>{SECRET_DEAL.price} <span className='text-gray-500 text-xs font-normal'>{SECRET_DEAL.real_price}</span></span>
                                <a 
                                     href={SECRET_DEAL.url} 
                                     target='_blank' 
                                     className='text-[10px] font-bold text-black bg-green-500 px-3 py-1 rounded hover:bg-green-400 transition-colors'
                                 >
                                    ACCESS
                                 </a>
                            </div>
                         </div>
                    </div>
                )}

            </div>
            
            {/* Scanline decoration */}
            <div className='absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20'></div>
        </div>
    );
};

export default MysteryTicker;

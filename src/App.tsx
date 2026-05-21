import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ExternalLink, 
  Link2, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  ShieldCheck, 
  ScanLine, 
  ChevronRight,
  MoveRight
} from 'lucide-react';
import { getSupabase } from './lib/supabase';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shortPath, setShortPath] = useState('');
  const [targetUrl, setTargetUrl] = useState<string | null>(null);

  useEffect(() => {
    // Extract slug from pathname (e.g., /my-link -> my-link)
    const path = window.location.pathname.substring(1);
    setShortPath(path);

    if (!path) {
      setLoading(false);
      return;
    }

    const performRedirect = async () => {
      try {
        const supabase = getSupabase();
        const { data, error: supabaseError } = await supabase
          .from('redirects') 
          .select('url')
          .eq('path', path)
          .single();

        if (supabaseError || !data) {
          setError('The requested link could not be found or may have expired.');
          setLoading(false);
          return;
        }

        setTargetUrl(data.url);
        setLoading(false);

        // Add a small delay for aesthetic transition as per design request
        setTimeout(() => {
          window.location.href = data.url;
        }, 2000);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected communication error occurred.');
        }
        setLoading(false);
      }
    };

    performRedirect();
  }, []);

  return (
    <div className="min-h-screen bg-white text-green-950 flex flex-col font-sans antialiased overflow-x-hidden">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative w-full mx-auto">
        {/* Background decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-50/80 rounded-full blur-3xl -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-[94vw] max-w-[500px] bg-white rounded-[clamp(1rem,4vw,1.5rem)] shadow-2xl border border-green-100 overflow-hidden"
        >
          {/* Top Accent Bar */}
          <div className="h-[clamp(4px,1vw,6px)] w-full bg-green-800"></div>

          {/* Train Animation */}
          <div className="w-full overflow-hidden bg-green-50/30 relative">
            <img 
              src="https://link-cdn.fitrimahadzir.my/train-fast.gif" 
              alt="Redirecting..." 
              className="w-full h-auto block scale-x-[-1]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
          </div>
          
          <div className="p-[clamp(1.5rem,5vw,2.5rem)]">
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="text-center space-y-[clamp(1.5rem,5vw,2rem)]"
                >
                  {/* Status Icon with animation */}
                  <div className="mb-[clamp(1rem,5vw,2rem)] flex justify-center">
                    <div className="relative">
                      {/* Outer spinning ring */}
                      <div className="w-[clamp(4rem,15vw,6rem)] h-[clamp(4rem,15vw,6rem)] border-[clamp(2px,1vw,4px)] border-green-50 border-t-green-700 rounded-full animate-spin"></div>
                      {/* Inner static icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <MoveRight className="w-[clamp(1.5rem,6vw,2rem)] h-[clamp(1.5rem,6vw,2rem)] text-green-700" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-[clamp(0.5rem,2vw,1rem)]">
                    <h1 className="text-[clamp(1.5rem,6vw,1.875rem)] font-extrabold text-green-950 tracking-tight flex items-center justify-center">
                      Redirecting
                      <span className="inline-flex ml-1">
                        <motion.span
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                        >.</motion.span>
                        <motion.span
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                        >.</motion.span>
                        <motion.span
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                        >.</motion.span>
                      </span>
                    </h1>
                    <p className="text-green-800 text-[clamp(0.875rem,3.5vw,1.125rem)] leading-relaxed max-w-[80%] md:max-w-sm mx-auto font-medium">
                      You are being redirected to the destination. Please wait a moment.
                    </p>
                  </div>

                  <div className="bg-white border border-green-100 rounded-[clamp(0.75rem,4vw,1rem)] p-[clamp(1rem,4vw,1.5rem)] shadow-sm">
                    <span className="block text-[clamp(0.875rem,3vw,1rem)] font-black text-green-800 mb-[clamp(0.5rem,2vw,1rem)] tracking-wide text-center">Destination Link</span>
                    <div className="flex items-stretch gap-[clamp(0.35rem,2vw,0.625rem)] w-full">
                      <a 
                        href={targetUrl || '#'}
                        onClick={(e) => { if (!targetUrl) e.preventDefault(); }}
                        className="bg-green-50/50 hover:bg-green-100/80 transition-colors border border-green-100 shadow-sm rounded-[clamp(0.5rem,2vw,0.75rem)] flex-1 flex items-center px-[clamp(0.5rem,3vw,1rem)] overflow-hidden"
                      >
                        <span className="text-[clamp(0.7rem,2.5vw,0.875rem)] font-mono text-green-900 font-medium truncate w-full text-left">
                          {targetUrl || 'Verifying connection...'}
                        </span>
                      </a>
                      <a 
                        href={targetUrl || '#'}
                        onClick={(e) => { if (!targetUrl) e.preventDefault(); }}
                        className="bg-green-50/50 hover:bg-green-100/80 transition-colors p-[clamp(0.35rem,2vw,0.625rem)] rounded-[clamp(0.5rem,2vw,0.75rem)] border border-green-100 shadow-sm shrink-0 flex items-center justify-center cursor-pointer"
                      >
                        <ExternalLink className="w-[clamp(12px,3vw,16px)] h-[clamp(12px,3vw,16px)] text-green-700" />
                      </a>
                    </div>
                  </div>
                  <p className="text-green-800 text-[clamp(0.75rem,3vw,1.125rem)] leading-relaxed max-w-md mx-auto font-medium mt-[clamp(0.5rem,2vw,1rem)]">
                    If you aren't redirected in a few seconds,<br />click the link above.
                  </p>
                </motion.div>
              ) : error ? (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center space-y-[clamp(1.5rem,5vw,2rem)]"
                >
                  <div className="inline-flex items-center justify-center w-[clamp(4rem,15vw,6rem)] h-[clamp(4rem,15vw,6rem)] bg-red-50 text-red-600 rounded-[clamp(1rem,4vw,1.5rem)] mb-[clamp(0.25rem,1vw,0.5rem)] shadow-inner">
                    <AlertCircle className="w-[clamp(2rem,8vw,3rem)] h-[clamp(2rem,8vw,3rem)]" />
                  </div>
                  <div className="space-y-[clamp(0.5rem,2vw,0.75rem)]">
                    <h1 className="text-[clamp(1.5rem,6vw,1.875rem)] font-bold text-green-950">Transfer Interrupted</h1>
                    <p className="text-green-800 text-[clamp(0.875rem,3.5vw,1.125rem)] max-w-sm mx-auto">
                      {error}
                    </p>
                  </div>
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="w-full py-[clamp(0.75rem,3vw,1rem)] bg-green-900 hover:bg-green-800 text-white font-bold text-[clamp(0.875rem,3.5vw,1rem)] rounded-[clamp(0.75rem,4vw,1rem)] shadow-lg transition-all flex items-center justify-center gap-[clamp(0.5rem,2vw,0.75rem)] group"
                  >
                    <span>Return to Dashboard</span>
                    <ChevronRight className="w-[clamp(1rem,4vw,1.25rem)] h-[clamp(1rem,4vw,1.25rem)] group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              ) : !shortPath ? (
                <motion.div 
                  key="welcome"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-[clamp(1.5rem,5vw,2.5rem)]"
                >
                  <div className="space-y-[clamp(0.5rem,2vw,1rem)]">
                    <h1 className="text-[clamp(1.75rem,7vw,2.25rem)] font-black text-green-950 tracking-tight flex items-center justify-center">
                      Redirecting
                      <span className="inline-flex ml-1">
                        <motion.span
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                        >.</motion.span>
                        <motion.span
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
                        >.</motion.span>
                        <motion.span
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
                        >.</motion.span>
                      </span>
                    </h1>
                    <p className="text-green-800 text-[clamp(0.875rem,3.5vw,1.125rem)] leading-relaxed max-w-[80%] md:max-w-md mx-auto font-medium">
                      You are being redirected to the destination. Please wait a moment.
                    </p>
                  </div>
                  
                  <div className="bg-white border border-green-100 rounded-[clamp(0.75rem,4vw,1rem)] p-[clamp(1rem,4vw,1.5rem)] shadow-sm">
                    <span className="block text-[clamp(0.875rem,3vw,1rem)] font-black text-green-800 mb-[clamp(0.5rem,2vw,1rem)] tracking-wide text-center">Destination Link</span>
                    <div className="flex items-stretch gap-[clamp(0.35rem,2vw,0.625rem)] w-full">
                      <a 
                        href={targetUrl || 'https://www.fitrimahadzir.my'}
                        className="bg-green-50/50 hover:bg-green-100/80 transition-colors border border-green-100 shadow-sm rounded-[clamp(0.5rem,2vw,0.75rem)] flex-1 flex items-center px-[clamp(0.5rem,3vw,1rem)] overflow-hidden"
                      >
                        <span className="text-[clamp(0.7rem,2.5vw,0.875rem)] font-mono text-green-900 font-medium truncate w-full text-left">
                          {targetUrl || 'https://www.fitrimahadzir.my'}
                        </span>
                      </a>
                      <a 
                        href={targetUrl || 'https://www.fitrimahadzir.my'}
                        className="bg-green-50/50 hover:bg-green-100/80 transition-colors p-[clamp(0.35rem,2vw,0.625rem)] rounded-[clamp(0.5rem,2vw,0.75rem)] border border-green-100 shadow-sm shrink-0 flex items-center justify-center"
                      >
                        <ExternalLink className="w-[clamp(12px,3vw,16px)] h-[clamp(12px,3vw,16px)] text-green-700" />
                      </a>
                    </div>
                  </div>
                  <p className="text-green-800 text-[clamp(0.75rem,3vw,1.125rem)] leading-relaxed max-w-md mx-auto font-medium mt-[clamp(0.5rem,2vw,1rem)]">
                    If you aren't redirected in a few seconds,<br />click the link above.
                  </p>
                </motion.div>
              ) : (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-[clamp(1.5rem,5vw,2rem)]"
                >
                  {/* Success redirection state */}
                   <div className="mb-[clamp(1rem,5vw,2rem)] flex justify-center">
                    <div className="w-[clamp(4rem,12vw,5rem)] h-[clamp(4rem,12vw,5rem)] bg-emerald-50 rounded-full flex items-center justify-center border-[clamp(2px,1vw,4px)] border-emerald-100">
                      <ShieldCheck className="w-[clamp(1.5rem,6vw,2.5rem)] h-[clamp(1.5rem,6vw,2.5rem)] text-emerald-600" />
                    </div>
                  </div>

                  <div className="space-y-[clamp(0.5rem,2vw,0.75rem)]">
                    <h1 className="text-[clamp(1.5rem,6vw,1.875rem)] font-bold text-green-950">Redirection Confirmed</h1>
                    <p className="text-green-800 text-[clamp(0.875rem,3vw,1rem)]">Security check passed. Sending you to:</p>
                  </div>

                  <div className="bg-green-50 border border-green-100 rounded-[clamp(0.5rem,3vw,0.75rem)] p-[clamp(0.75rem,3vw,1.25rem)] break-all">
                    <span className="text-green-800 font-mono text-[clamp(0.75rem,2.5vw,0.875rem)] leading-relaxed">
                      {targetUrl}
                    </span>
                  </div>

                  <button 
                    onClick={() => targetUrl && (window.location.href = targetUrl)}
                    className="w-full py-[clamp(0.75rem,3vw,1rem)] bg-green-700 hover:bg-green-800 text-white font-bold text-[clamp(0.875rem,3.5vw,1rem)] rounded-[clamp(0.75rem,4vw,1rem)] shadow-xl shadow-green-100 transition-all flex items-center justify-center gap-[clamp(0.5rem,2vw,0.75rem)]"
                  >
                    <span>Click here if redirect fails</span>
                    <ExternalLink className="w-[clamp(12px,3vw,16px)] h-[clamp(12px,3vw,16px)]" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Security Badge Section */}
          <div className="bg-white border-t border-green-100 px-[clamp(1rem,4vw,2rem)] py-[clamp(0.75rem,3vw,1.25rem)] flex gap-2 sm:gap-4 items-center justify-center">
            <div className="flex items-center text-green-700/70 whitespace-nowrap">
              <ShieldCheck className="w-[clamp(12px,3vw,16px)] h-[clamp(12px,3vw,16px)] mr-1.5 sm:mr-2 shrink-0" />
              <span className="text-[clamp(7px,1.8vw,9px)] uppercase font-bold tracking-widest leading-none">Verified Destination</span>
            </div>
            <div className="h-[clamp(10px,2vw,16px)] w-[1px] bg-green-200 shrink-0"></div>
            <div className="flex items-center text-green-700/70 whitespace-nowrap">
              <ScanLine className="w-[clamp(12px,3vw,16px)] h-[clamp(12px,3vw,16px)] mr-1.5 sm:mr-2 shrink-0" />
              <span className="text-[clamp(7px,1.8vw,9px)] uppercase font-bold tracking-widest leading-none">Real-time Scanning</span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

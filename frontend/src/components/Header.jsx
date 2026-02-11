import { motion } from 'motion/react';
import { Hexagon } from 'lucide-react';
import WalletGuard from './Header/WalletGuard';
import WalletConnect from './Header/WalletConnect';

const onLogoClick = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

export function Header({
  // isConnected,
  // walletAddress,
  // onConnect,
  // onDisconnect,

}) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-slate-900/95 to-slate-900/90 backdrop-blur-sm border-b border-purple-500/20">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={onLogoClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div 
            className="relative"
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <Hexagon className="w-8 h-8 text-purple-500 group-hover:text-cyan-400 transition-colors" />
          </motion.div>

          <span className="text-xl bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent group-hover:from-cyan-400 group-hover:via-purple-400 group-hover:to-pink-400 transition-all duration-500">
            NFT Marketplace
          </span>
        </motion.div>

        <>
          <WalletGuard />
          <WalletConnect />
        </>
      </div>
    </header>
  );
}

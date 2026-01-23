import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = ['Items', 'Marketplace', 'My NFTs', 'Mint'];

export function Navigation({ activeSection, onSectionChange }: NavigationProps) {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.5 + 72;
      setIsSticky(window.scrollY >= heroHeight);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      className={`z-40 transition-all duration-300 ${
        isSticky
          ? 'fixed top-[72px] left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-b border-purple-500/20 shadow-lg'
          : 'relative bg-gradient-to-b from-slate-800/80 to-slate-900/80'
      }`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-center gap-2">
          {sections.map((section) => (
            <motion.button
              key={section}
              onClick={() => onSectionChange(section)}
              className={`relative px-6 py-4 transition-all ${
                activeSection === section
                  ? 'text-purple-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">{section}</span>
              {activeSection === section && (
                <motion.div
                  layoutId="activeSection"
                  className={`absolute inset-0 rounded-lg ${
                    isSticky
                      ? 'bg-purple-500/10 border border-purple-500/30'
                      : 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/50'
                  }`}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}

import { motion } from 'motion/react';
import { Hexagon, Twitter, Github, MessageCircle, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative mt-20 py-12 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-purple-500/20">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-slate-900" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 mb-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <Hexagon className="w-8 h-8 text-purple-500" />
              </motion.div>
              <span className="text-xl bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                NFT Marketplace
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              The premier destination for discovering, collecting, and trading unique digital assets.
              Join the future of digital ownership powered by blockchain technology.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg mb-4 text-purple-400">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Explore NFTs
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Create & Sell
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-purple-400 transition-colors">
                  Community
                </a>
              </li>
            </ul>
          </div>

          {/* Connect Section */}
          <div>
            <h3 className="text-lg mb-4 text-purple-400">Connect With Us</h3>
            <div className="flex gap-3 mb-4">
              <motion.a
                href="#"
                className="p-3 bg-slate-800/50 rounded-lg border border-purple-500/30 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Twitter className="w-5 h-5 text-blue-400" />
              </motion.a>
              <motion.a
                href="#"
                className="p-3 bg-slate-800/50 rounded-lg border border-purple-500/30 hover:border-gray-500/50 hover:bg-gray-500/10 transition-all"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github className="w-5 h-5 text-gray-400" />
              </motion.a>
              <motion.a
                href="#"
                className="p-3 bg-slate-800/50 rounded-lg border border-purple-500/30 hover:border-green-500/50 hover:bg-green-500/10 transition-all"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="w-5 h-5 text-green-400" />
              </motion.a>
              <motion.a
                href="#"
                className="p-3 bg-slate-800/50 rounded-lg border border-purple-500/30 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Mail className="w-5 h-5 text-pink-400" />
              </motion.a>
            </div>
            <p className="text-gray-400 text-sm">
              Stay updated with the latest drops and community news.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-purple-500/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 NFT Marketplace. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-purple-400 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-purple-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-purple-400 transition-colors">
              Help Center
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

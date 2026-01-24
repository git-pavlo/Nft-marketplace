import { useState } from 'react';
import { Header } from './components/Header';
import { HeroSlider } from './components/HeroSlider';
import { Navigation } from './components/Navigation';
import { Items } from './container/Items';
import { Marketplace } from './container/Marketplace';
import { MyNFTs } from './container/MyNFTs';
import { Mint } from './container/Mint';
import { Footer } from './components/Footer';
import { mockNFTs } from './data/mockNFTs';
import { motion } from 'motion/react';
import { toast, Toaster } from 'sonner@2.0.3';
import { useAccount, useDisconnect } from "wagmi";

function App() {
  const { isConnected, address } = useAccount();
  const [activeSection, setActiveSection] = useState('Items');

  const renderSection = () => {
    switch (activeSection) {
      case 'Items':
        return <Items connectedWallet={address} />;

      case 'Marketplace':
        return (
          <Marketplace connectedWallet={address} isConnected={isConnected} />
        );

      case 'My NFTs':
        if (!isConnected) {
          return (
            <div className="container mx-auto px-6 py-20 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto"
              >
                <h2 className="text-2xl mb-4 text-gray-300">
                  Connect Your Wallet
                </h2>
                <p className="text-gray-400 mb-6">
                  Please connect your wallet to view your NFT collection.
                </p>
              </motion.div>
            </div>
          );
        }

        return (
          <MyNFTs connectedWallet={address} />
        );

      case 'Mint':
        if (!isConnected) {
          return (
            <div className="container mx-auto px-6 py-20 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md mx-auto"
              >
                <h2 className="text-2xl mb-4 text-gray-300">
                  Connect Your Wallet
                </h2>
                <p className="text-gray-400 mb-6">
                  Please connect your wallet to mint new NFTs.
                </p>
              </motion.div>
            </div>
          );
        }

        return (
          <Mint />
        );

      default:
        return <Items connectedWallet={address} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <Toaster position="top-right" theme="dark" richColors />

      <Header />

      <HeroSlider />

      <Navigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <main className="min-h-[60vh]">{renderSection()}</main>

      <Footer />
    </div>
  );
}

export default App;

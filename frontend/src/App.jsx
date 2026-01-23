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
import { ConnectButton } from "@rainbow-me/rainbowkit";

function App() {
  const { isConnected, address } = useAccount();
  const [activeSection, setActiveSection] = useState('Items');
  const [nfts, setNfts] = useState(mockNFTs);
  const [nextTokenId, setNextTokenId] = useState(11);

  console.log(isConnected);
  console.log(address);
  console.log(activeSection);


  const handleBuyNFT = (nft) => {
    const updatedNFTs = nfts.map((n) =>
      n.id === nft.id
        ? {
            ...n,
            owner: address,
            seller: undefined,
            forSale: false,
            transactionHistory: [
              ...n.transactionHistory,
              {
                id: `t${Date.now()}`,
                type: 'sale',
                from: n.seller || n.owner,
                to: address,
                price: n.price,
                date: new Date().toISOString().split('T')[0],
              },
            ],
          }
        : n
    );

    setNfts(updatedNFTs);
    setActiveSection('My NFTs');
    toast.success(`Successfully purchased ${nft.name}!`);
  };

  const handleSellNFT = (nft, price) => {
    const updatedNFTs = nfts.map((n) =>
      n.id === nft.id
        ? {
            ...n,
            price,
            forSale: true,
            seller: address,
          }
        : n
    );

    setNfts(updatedNFTs);
    toast.success(`${nft.name} listed for ${price} ETH!`);
  };

  const handleCancelListing = (nft) => {
    const updatedNFTs = nfts.map((n) =>
      n.id === nft.id
        ? {
            ...n,
            forSale: false,
            seller: undefined,
          }
        : n
    );

    setNfts(updatedNFTs);
    toast.info(`Listing cancelled for ${nft.name}`);
  };

  const handleMintNFT = (nftData) => {
    const newNFT = {
      ...nftData,
      id: String(nfts.length + 1),
      tokenId: `#${String(nextTokenId).padStart(3, '0')}`,
      transactionHistory: [
        {
          id: `t${Date.now()}`,
          type: 'mint',
          from: '0x0000...0000',
          to: address,
          date: new Date().toISOString().split('T')[0],
        },
      ],
    };

    setNfts([...nfts, newNFT]);
    setNextTokenId(nextTokenId + 1);
    toast.success(`Successfully minted ${nftData.name}!`);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'Items':
        return <Items nfts={nfts} connectedWallet={address} />;

      case 'Marketplace':
        return (
          <Marketplace
            nfts={nfts}
            connectedWallet={address}
            isConnected={isConnected}
            onBuyNFT={handleBuyNFT}
          />
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
          <MyNFTs
            nfts={nfts}
            connectedWallet={address}
            onSellNFT={handleSellNFT}
            onCancelListing={handleCancelListing}
          />
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
          <Mint
            connectedWallet={address}
            onMintNFT={handleMintNFT}
          />
        );

      default:
        return <Items nfts={nfts} connectedWallet={address} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      <Toaster position="top-right" theme="dark" richColors />

      <Header
        // isConnected={isConnected}
        // address={address}
        // onConnect={handleConnect}
        // onDisconnect={handleDisconnect}
        // onLogoClick={handleLogoClick}
      />

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

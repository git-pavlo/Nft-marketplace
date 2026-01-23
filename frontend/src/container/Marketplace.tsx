import { useState } from 'react';
import { NFT } from '../types/nft';
import { Aside } from './Aside';
import { NFTCard } from '../components/NFTCard';
import { NFTDetail } from './NFTDetail';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, X } from 'lucide-react';

interface MarketplaceProps {
  nfts: NFT[];
  connectedWallet: string;
  isConnected: boolean;
  onBuyNFT: (nft: NFT) => void;
}

export function Marketplace({ nfts, connectedWallet, isConnected, onBuyNFT }: MarketplaceProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'recent'>('recent');
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);
  const [showConnectAlert, setShowConnectAlert] = useState(false);

  // Filter NFTs for marketplace (only for sale, not owned by connected wallet)
  const marketplaceNFTs = nfts
    .filter((nft) => nft.forSale && nft.seller !== connectedWallet)
    .filter((nft) => {
      const matchesSearch = nft.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCollection =
        selectedCollection === 'All' || nft.collection === selectedCollection;
      const matchesMinPrice = !minPrice || nft.price >= parseFloat(minPrice);
      const matchesMaxPrice = !maxPrice || nft.price <= parseFloat(maxPrice);

      return matchesSearch && matchesCollection && matchesMinPrice && matchesMaxPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price') {
        return a.price - b.price;
      }
      return b.id.localeCompare(a.id);
    });

  const handleBuy = (nft: NFT) => {
    if (!isConnected) {
      setShowConnectAlert(true);
      return;
    }
    onBuyNFT(nft);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex gap-6">
        <Aside
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCollection={selectedCollection}
          onCollectionChange={setSelectedCollection}
          minPrice={minPrice}
          onMinPriceChange={setMinPrice}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <div className="flex-1">
          <h2 className="text-3xl mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Marketplace
          </h2>

          {marketplaceNFTs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No NFTs available in the marketplace.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketplaceNFTs.map((nft) => (
                <NFTCard
                  key={nft.id}
                  nft={nft}
                  onClick={() => setSelectedNFT(nft)}
                  showBuyButton
                  onBuy={() => handleBuy(nft)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedNFT && (
          <NFTDetail nft={selectedNFT} onClose={() => setSelectedNFT(null)} />
        )}

        {showConnectAlert && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConnectAlert(false)}
          >
            <motion.div
              className="bg-slate-800 rounded-2xl border border-purple-500/30 p-6 max-w-md w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-yellow-500" />
                  <h3 className="text-xl">Wallet Not Connected</h3>
                </div>
                <button
                  onClick={() => setShowConnectAlert(false)}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-400 mb-6">
                Please connect your wallet to purchase NFTs from the marketplace.
              </p>
              <button
                onClick={() => setShowConnectAlert(false)}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

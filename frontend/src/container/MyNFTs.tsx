import { useState } from 'react';
import { NFT } from '../types/nft';
import { Aside } from './Aside';
import { NFTCard } from '../components/NFTCard';
import { NFTDetail } from './NFTDetail';
import { AnimatePresence } from 'motion/react';
import { Package } from 'lucide-react';

interface MyNFTsProps {
  nfts: NFT[];
  connectedWallet: string;
  onSellNFT: (nft: NFT, price: number) => void;
  onCancelListing: (nft: NFT) => void;
}

export function MyNFTs({ nfts, connectedWallet, onSellNFT, onCancelListing }: MyNFTsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCollection, setSelectedCollection] = useState('All');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'recent'>('recent');
  const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

  // My NFTs for sale
  const myListedNFTs = nfts
    .filter((nft) => nft.owner === connectedWallet && nft.forSale)
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

  // My NFTs not for sale
  const myOwnedNFTs = nfts
    .filter((nft) => nft.owner === connectedWallet && !nft.forSale)
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
          {/* Listed NFTs Section */}
          <div className="mb-12">
            <h2 className="text-3xl mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Currently Listed
            </h2>

            {myListedNFTs.length === 0 ? (
              <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-purple-500/20">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                <p className="text-gray-400">You have no NFTs listed for sale.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myListedNFTs.map((nft) => (
                  <NFTCard
                    key={nft.id}
                    nft={nft}
                    onClick={() => setSelectedNFT(nft)}
                    showCancelButton
                    onCancel={() => onCancelListing(nft)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Owned NFTs Section */}
          <div>
            <h2 className="text-3xl mb-6 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              My Collection
            </h2>

            {myOwnedNFTs.length === 0 ? (
              <div className="text-center py-12 bg-slate-800/30 rounded-xl border border-purple-500/20">
                <Package className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                <p className="text-gray-400">You don't own any NFTs yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myOwnedNFTs.map((nft) => (
                  <NFTCard
                    key={nft.id}
                    nft={nft}
                    onClick={() => setSelectedNFT(nft)}
                    showSellButton
                    onSell={(price) => onSellNFT(nft, price)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedNFT && (
          <NFTDetail nft={selectedNFT} onClose={() => setSelectedNFT(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}

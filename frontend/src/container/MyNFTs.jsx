import { useState, useEffect } from "react";
import { Aside } from "./Aside";
import { NFTCard } from "../components/NFTCard";
import { NFTDetail } from "./NFTDetail";
import { AnimatePresence } from "motion/react";
import { Package } from "lucide-react";
import { fetchAllNFTs, onSellNFT, onCancelListing } from "../utils/contract";
import { toast } from "sonner"; // optional for notifications

export function MyNFTs({ connectedWallet }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [nfts, setNFTs] = useState([]); // ✅ Initialize as array
  const [loading, setLoading] = useState(true);

  // Load NFTs on mount
  useEffect(() => {
    const loadNFTs = async () => {
      try {
        const allNFTs = await fetchAllNFTs();
        setNFTs(Array.isArray(allNFTs) ? allNFTs : []); // ✅ Ensure array
      } catch (err) {
        console.error("Failed to load NFTs", err);
        setNFTs([]);
        toast.error("Failed to load NFTs");
      } finally {
        setLoading(false);
      }
    };
    loadNFTs();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-400">Loading NFTs...</div>
    );
  }

  // Filter NFTs currently listed for sale
  const myListedNFTs = (nfts || [])
    .filter((nft) => nft.owner === connectedWallet && nft.forSale)
    .filter((nft) => {
      const matchesSearch = nft.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCollection =
        selectedCollection === "All" || nft.collection === selectedCollection;
      const matchesMinPrice = !minPrice || nft.price >= parseFloat(minPrice);
      const matchesMaxPrice = !maxPrice || nft.price <= parseFloat(maxPrice);
      return matchesSearch && matchesCollection && matchesMinPrice && matchesMaxPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      return b.id?.toString().localeCompare(a.id?.toString());
    });

  // Filter NFTs owned but not listed
  const myOwnedNFTs = (nfts || [])
    .filter((nft) => nft.owner === connectedWallet && !nft.forSale)
    .filter((nft) => {
      const matchesSearch = nft.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCollection =
        selectedCollection === "All" || nft.collection === selectedCollection;
      const matchesMinPrice = !minPrice || nft.price >= parseFloat(minPrice);
      const matchesMaxPrice = !maxPrice || nft.price <= parseFloat(maxPrice);
      return matchesSearch && matchesCollection && matchesMinPrice && matchesMaxPrice;
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      return b.id?.toString().localeCompare(a.id?.toString());
    });

  // Sell NFT
  const handleSellNFT = async (nft, price) => {
    try {
      await onSellNFT(nft.tokenId, price.toString());
      toast.success(`${nft.name} listed for ${price} ETH`);
      const updatedNFTs = await fetchAllNFTs();
      setNFTs(Array.isArray(updatedNFTs) ? updatedNFTs : []);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to list ${nft.name}`);
    }
  };

  // Cancel NFT listing
  const handleCancelListing = async (nft) => {
    try {
      await onCancelListing(nft.tokenId);
      toast.info(`${nft.name} listing cancelled`);
      const updatedNFTs = await fetchAllNFTs();
      setNFTs(Array.isArray(updatedNFTs) ? updatedNFTs : []);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to cancel listing for ${nft.name}`);
    }
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
                    onCancel={() => handleCancelListing(nft)}
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
                    onSell={(price) => handleSellNFT(nft, price)}
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

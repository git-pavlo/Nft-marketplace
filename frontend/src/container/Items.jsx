import { useState, useEffect } from "react";
import { Aside } from "./Aside";
import { NFTCard } from "../components/NFTCard";
import { NFTDetail } from "./NFTDetail";
import { AnimatePresence } from "motion/react";
import { fetchAllNFTs } from "../utils/contract";
import { ethers } from "ethers";

export function Items({ connectedWallet }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [nfts, setNFTs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNFTs() {
      try {
        const allNFTs = await fetchAllNFTs();
        setNFTs(allNFTs);
      } catch (err) {
        console.error("Failed to load NFTs", err);
      } finally {
        setLoading(false);
      }
    }
    loadNFTs();
  }, []);

  // Filter + Sort
  const filteredNFTs = nfts
    .map((nft) => ({
      ...nft,
      isMine:
        connectedWallet &&
        nft.owner?.toLowerCase() === connectedWallet.toLowerCase(),
      priceEth: nft.price ? Number(ethers.formatEther(nft.price)) : 0,
    }))
    .filter((nft) => {
      const matchesSearch =
        (nft.name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCollection =
        selectedCollection === "All" || nft.collection === selectedCollection;
      const matchesMinPrice =
        !minPrice || nft.priceEth >= parseFloat(minPrice);
      const matchesMaxPrice =
        !maxPrice || nft.priceEth <= parseFloat(maxPrice);
      return (
        matchesSearch &&
        matchesCollection &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.priceEth - b.priceEth;
      return Number(b.tokenId) - Number(a.tokenId);
    });

  if (loading) return <p className="text-center py-12 text-gray-400">Loading NFTs...</p>;

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
            All Items
          </h2>

          {filteredNFTs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No NFTs found matching your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNFTs.map((nft) => (
                <NFTCard
                  key={nft.tokenId}
                  nft={nft}
                  onClick={() => setSelectedNFT(nft)}
                  showMineIndicator
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedNFT && (
          <NFTDetail
            nft={selectedNFT}
            onClose={() => setSelectedNFT(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

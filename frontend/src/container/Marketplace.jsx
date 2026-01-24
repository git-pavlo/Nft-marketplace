import { useEffect, useState } from "react";
import { Aside } from "./Aside";
import { NFTCard } from "../components/NFTCard";
import { NFTDetail } from "./NFTDetail";
import { AnimatePresence, motion } from "motion/react";
import { AlertCircle, X } from "lucide-react";
import { fetchAllNFTs, buyNFT } from "../utils/contract";
import { ethers } from "ethers";

export function Marketplace({ connectedWallet, isConnected }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [showConnectAlert, setShowConnectAlert] = useState(false);
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

  const marketplaceNFTs = nfts
    .filter((nft) => nft.forSale && nft.seller !== connectedWallet)
    .filter((nft) => {
      const priceEth = Number(ethers.formatEther(nft.price));

      const matchesSearch = nft.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCollection =
        selectedCollection === "All" ||
        nft.collection === selectedCollection;
      const matchesMinPrice = !minPrice || priceEth >= Number(minPrice);
      const matchesMaxPrice = !maxPrice || priceEth <= Number(maxPrice);

      return (
        matchesSearch &&
        matchesCollection &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    })
    .sort((a, b) => {
      if (sortBy === "price") {
        return Number(a.price - b.price);
      }
      return b.tokenId - a.tokenId;
    });

  // ✅ BUY HANDLER
  const onBuyNFT = async (nft) => {
    if (!isConnected) {
      setShowConnectAlert(true);
      return;
    }

    try {
      await buyNFT(nft.tokenId, nft.price);
      alert("NFT purchased successfully!");
      const refreshed = await fetchAllNFTs();
      setNFTs(refreshed);
    } catch (err) {
      console.error("Buy failed", err);
      alert("Transaction failed");
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400">
        Loading marketplace...
      </div>
    );
  }

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
              No NFTs available.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketplaceNFTs.map((nft) => (
                <NFTCard
                  key={nft.tokenId}
                  nft={nft}
                  onClick={() => setSelectedNFT(nft)}
                  showBuyButton
                  onBuy={() => onBuyNFT(nft)}
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

        {showConnectAlert && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90"
            onClick={() => setShowConnectAlert(false)}
          >
            <motion.div
              className="bg-slate-800 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 text-yellow-500" />
                  <h3 className="text-xl">Wallet Not Connected</h3>
                </div>
                <button onClick={() => setShowConnectAlert(false)}>
                  <X />
                </button>
              </div>

              <p className="text-gray-400 mb-6">
                Please connect your wallet to buy NFTs.
              </p>

              <button
                onClick={() => setShowConnectAlert(false)}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600"
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

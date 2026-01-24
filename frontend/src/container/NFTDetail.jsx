import { motion } from "motion/react";
import { X, Calendar, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { getTransactionHistory } from "../utils/contract";

export function NFTDetail({ nft, onClose }) {
  const [transactions, setTransactions] = useState([]);
  const [loadingTx, setLoadingTx] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const txs = await getTransactionHistory(nft.tokenId);
        setTransactions(txs);
      } catch (err) {
        console.error("Failed to load transaction history", err);
      } finally {
        setLoadingTx(false);
      }
    }

    loadHistory();
  }, [nft.tokenId]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-slate-800 rounded-2xl border border-purple-500/30 max-w-5xl w-full max-h-[90vh] overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
          <h2 className="text-2xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            NFT Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
          {/* Left: Image */}
          <div className="relative rounded-xl overflow-hidden aspect-square">
            <img
              src={nft.image}
              alt={nft.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent" />
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Token #{nft.tokenId}
              </p>
              <h1 className="text-3xl mb-2">{nft.name}</h1>
              <span className="inline-block px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-sm">
                {nft.collection}
              </span>
            </div>

            {/* Price */}
            <div className="p-4 bg-slate-900/50 rounded-lg border border-purple-500/20">
              <p className="text-sm text-gray-400 mb-1">Current Price</p>
              <p className="text-3xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {nft.price} ETH
              </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-sm text-gray-400 mb-2">Description</h3>
              <p className="text-gray-300">{nft.description}</p>
            </div>

            {/* Owner / Seller */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900/50 rounded-lg border border-purple-500/20">
                <p className="text-sm text-gray-400 mb-1">Owner</p>
                <p className="text-white truncate">{nft.owner}</p>
              </div>

              {nft.seller && (
                <div className="p-4 bg-slate-900/50 rounded-lg border border-purple-500/20">
                  <p className="text-sm text-gray-400 mb-1">Seller</p>
                  <p className="text-white truncate">{nft.seller}</p>
                </div>
              )}
            </div>

            {/* Transaction History */}
            {transactions.length > 0 && (
              <div>
                <h3 className="text-sm text-gray-400 mb-3">
                  Transaction History
                </h3>

                <div className="space-y-2">
                  {transactions.map((tx, index) => (
                    <div
                      key={index}
                      className="p-3 bg-slate-900/50 rounded-lg border border-purple-500/20 flex items-center gap-3"
                    >
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        {tx.type === "mint" && (
                          <Calendar className="w-4 h-4 text-purple-400" />
                        )}
                        {(tx.type === "sale" || tx.type === "transfer") && (
                          <ArrowRight className="w-4 h-4 text-green-400" />
                        )}
                      </div>

                      <div className="flex-1">
                        <p className="text-sm capitalize text-white">
                          {tx.type}
                        </p>
                        <p className="text-xs text-gray-400">
                          From {tx.from} → {tx.to}
                        </p>
                      </div>

                      <div className="text-right">
                        {tx.price && (
                          <p className="text-sm text-purple-400">
                            {tx.price} ETH
                          </p>
                        )}
                        <p className="text-xs text-gray-500">{tx.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

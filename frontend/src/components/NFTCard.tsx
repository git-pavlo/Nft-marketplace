import { motion } from 'motion/react';
import { Badge, ShoppingCart, X, Tag } from 'lucide-react';
import { NFT } from '../types/nft';

interface NFTCardProps {
  nft: NFT;
  onClick: () => void;
  showBuyButton?: boolean;
  showSellButton?: boolean;
  showCancelButton?: boolean;
  onBuy?: () => void;
  onSell?: (price: number) => void;
  onCancel?: () => void;
  showMineIndicator?: boolean;
}

export function NFTCard({
  nft,
  onClick,
  showBuyButton,
  showSellButton,
  showCancelButton,
  onBuy,
  onSell,
  onCancel,
  showMineIndicator,
}: NFTCardProps) {
  const handleSell = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const formData = new FormData(e.currentTarget);
    const price = parseFloat(formData.get('price') as string);
    if (price && onSell) {
      onSell(price);
    }
  };

  return (
    <motion.div
      className="bg-slate-800/50 rounded-xl overflow-hidden border border-purple-500/20 cursor-pointer group relative"
      whileHover={{
        y: -8,
        boxShadow: '0 20px 40px rgba(168, 85, 247, 0.3)',
      }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      {showMineIndicator && nft.isMine && (
        <div className="absolute top-3 right-3 z-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-2 shadow-lg">
          <Badge className="w-4 h-4" />
        </div>
      )}

      <div className="relative aspect-square overflow-hidden">
        <motion.img
          src={nft.image}
          alt={nft.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.4 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="text-xs text-gray-500">{nft.tokenId}</p>
            <h3 className="text-lg text-white group-hover:text-purple-400 transition-colors">
              {nft.name}
            </h3>
          </div>
          <span className="px-2 py-1 text-xs rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30">
            {nft.collection}
          </span>
        </div>

        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{nft.description}</p>

        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-500">Price</p>
            <p className="text-lg bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              {nft.price} ETH
            </p>
          </div>
          {!showSellButton && (
            <div>
              <p className="text-xs text-gray-500">{showBuyButton ? 'Seller' : 'Owner'}</p>
              <p className="text-sm text-gray-300">{showBuyButton ? nft.seller : nft.owner}</p>
            </div>
          )}
        </div>

        {showBuyButton && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onBuy?.();
            }}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ShoppingCart className="w-4 h-4" />
            Buy Now
          </motion.button>
        )}

        {showSellButton && (
          <form onSubmit={handleSell} onClick={(e) => e.stopPropagation()}>
            <div className="flex gap-2">
              <input
                type="number"
                name="price"
                step="0.1"
                placeholder="Set price (ETH)"
                defaultValue={nft.price}
                className="flex-1 px-3 py-2 bg-slate-900/50 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
              />
              <motion.button
                type="submit"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all flex items-center gap-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Tag className="w-4 h-4" />
                Sell
              </motion.button>
            </div>
          </form>
        )}

        {showCancelButton && (
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onCancel?.();
            }}
            className="w-full py-2 rounded-lg bg-red-600/20 border border-red-500/50 hover:bg-red-600/30 transition-all flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <X className="w-4 h-4" />
            Cancel Listing
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Loader2, CheckCircle } from 'lucide-react';
import { NFT } from '../types/nft';

interface MintProps {
  connectedWallet: string;
  onMintNFT: (nft: Omit<NFT, 'id' | 'tokenId' | 'transactionHistory'>) => void;
}

export function Mint({ connectedWallet, onMintNFT }: MintProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [name, setName] = useState('');
  const [collection, setCollection] = useState<'Artwork' | 'Portrait' | 'Animal' | 'Other'>(
    'Artwork'
  );
  const [description, setDescription] = useState('');
  const [isMinting, setIsMinting] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview || !name || !description) return;

    setIsMinting(true);

    // Simulate minting process
    setTimeout(() => {
      onMintNFT({
        name,
        collection,
        description,
        price: 0,
        image: imagePreview,
        owner: connectedWallet,
        forSale: false,
        seller: undefined,
      });

      setIsMinting(false);
      setMintSuccess(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        setMintSuccess(false);
        setImageFile(null);
        setImagePreview('');
        setName('');
        setDescription('');
        setCollection('Artwork');
      }, 2000);
    }, 2000);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-3xl mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Mint New NFT
      </h2>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Image Upload */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">Upload Image</label>
            {!imagePreview ? (
              <label className="block aspect-square rounded-xl border-2 border-dashed border-purple-500/30 hover:border-purple-500/60 transition-colors cursor-pointer bg-slate-800/30">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-gray-400">
                  <Upload className="w-12 h-12" />
                  <p>Click to upload image</p>
                  <p className="text-sm">PNG, JPG, GIF up to 10MB</p>
                </div>
              </label>
            ) : (
              <div className="relative aspect-square rounded-xl overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null);
                    setImagePreview('');
                  }}
                  className="absolute top-3 right-3 p-2 bg-red-600/80 hover:bg-red-600 rounded-lg transition-colors"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter NFT name"
                required
                className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Collection *</label>
              <select
                value={collection}
                onChange={(e) =>
                  setCollection(e.target.value as 'Artwork' | 'Portrait' | 'Animal' | 'Other')
                }
                className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 transition-colors"
              >
                <option value="Artwork">Artwork</option>
                <option value="Portrait">Portrait</option>
                <option value="Animal">Animal</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your NFT"
                required
                rows={6}
                className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg focus:outline-none focus:border-purple-500 transition-colors resize-none"
              />
            </div>

            <motion.button
              type="submit"
              disabled={!imagePreview || !name || !description || isMinting || mintSuccess}
              className="w-full py-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              whileHover={{ scale: !imagePreview || !name || !description || isMinting || mintSuccess ? 1 : 1.02 }}
              whileTap={{ scale: !imagePreview || !name || !description || isMinting || mintSuccess ? 1 : 0.98 }}
            >
              {isMinting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Minting...
                </>
              ) : mintSuccess ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Successfully Minted!
                </>
              ) : (
                'Mint NFT'
              )}
            </motion.button>

            {!imagePreview && (
              <p className="text-sm text-gray-500 text-center">
                Upload an image to get started
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

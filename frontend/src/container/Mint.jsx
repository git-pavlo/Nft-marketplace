import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Loader2, CheckCircle } from 'lucide-react';
import { uploadImageToIPFS, uploadMetadataToIPFS } from "../utils/ipfs";
import { getContract } from "../utils/contract";

export function Mint() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [name, setName] = useState('');
  const [collection, setCollection] = useState('Artwork');
  const [description, setDescription] = useState('');
  // const [isMinting, setIsMinting] = useState(false);
  // const [mintSuccess, setMintSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleMint() {
    try {
      if (!image || !name) return alert("Missing fields");

      setLoading(true);
      setStatus("Uploading image to IPFS...");

      const imageURI = await uploadImageToIPFS(image);

      console.log(imageURI);
      const metadata = {
        name,
        description,
        image: imageURI,
        attributes: [
          { trait_type: "Collection", value: collection }
        ],
      };

      setStatus("Uploading metadata to IPFS...");
      const metadataURI = await uploadMetadataToIPFS(metadata);

      setStatus("Minting NFT...");
      const contract = await getContract();

      const tx = await contract.mintNFT(metadataURI);
      await tx.wait();

      setStatus("🎉 NFT Minted Successfully!");
    } catch (err) {
      console.error(err);
      alert("Mint failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-3xl mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        Mint New NFT
      </h2>

      <form className="max-w-4xl mx-auto">
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
                    setImage(null);
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
                // value={collection}
                onChange={(e) => setCollection(e.target.value)}
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

            <button
              onClick={handleMint}  disabled={loading}
              className="w-full py-4 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? "Minting..." : "Mint NFT"}
            </button>

            {status && <p>{status}</p>}

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

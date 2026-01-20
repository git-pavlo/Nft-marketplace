import { useState } from "react"
import { ethers } from "ethers"
import { uploadFileToIPFS, uploadMetadata } from "../utils/pinata"
import { getNFTContract } from "../utils/web3"

export default function Mint() {
  const [image, setImage] = useState(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const MINT_FEE = 0.01

  /* ---------------- MINT NFT ---------------- */

  async function mintNFT() {
    if (!image || !name || !description) {
      alert("Please fill all fields")
      return
    }

    try {
      setLoading(true)

      // 1️⃣ Upload image
      const imageUrl = await uploadFileToIPFS(image)

      // 2️⃣ Upload metadata
      const metadataUrl = await uploadMetadata(name, description, imageUrl)

      // 3️⃣ Mint NFT
      const nft = await getNFTContract(true)
      const tx = await nft.mint(metadataUrl)
      await tx.wait()

      alert("✅ NFT minted successfully!")
    } catch (err) {
      console.error(err)

      let message = err?.reason || err?.data?.message || err.message

      if (message?.includes("Mint fee")) {
        alert("💰 Not enough ETH to mint.")
      } else if (message?.includes("user rejected")) {
        alert("❌ Transaction cancelled.")
      } else {
        alert("⚠️ " + message)
      }
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="max-w-md mx-auto mt-48 bg-slate-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl mb-5 text-cyan-400 font-bold text-center">
        Mint New NFT
      </h2>

      {/* IMAGE */}
      <div className="mb-4 flex">
        <input
          type="file"
          id="nft-image"
          accept="image/*"
          onChange={e => setImage(e.target.files[0])}
          className="hidden"
        />
        <label
          htmlFor="nft-image"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg cursor-pointer"
        >
          Choose image
        </label>
        {image && <p className="ml-3 text-gray-400">{image.name}</p>}
      </div>

      {/* NFT Info */}
      <input
        className="w-full p-2 mb-3 bg-slate-700 rounded"
        placeholder="NFT Name"
        onChange={e => setName(e.target.value)}
      />

      <textarea
        className="w-full p-2 mb-3 bg-slate-700 rounded h-40"
        placeholder="Description"
        onChange={e => setDescription(e.target.value)}
      />

      <button
        onClick={mintNFT}
        disabled={loading}
        className={`w-full py-2 rounded font-semibold transition
          ${loading
            ? "bg-gray-600 cursor-not-allowed"
            : "bg-cyan-500 hover:bg-cyan-600"
          }`}
      >
        {loading ? "Minting..." : "Mint NFT"}
      </button>
    </div>
  )
}

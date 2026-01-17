import { useState } from "react"
import { ethers } from "ethers"
import { uploadFileToIPFS, uploadMetadata } from "../utils/pinata"
import { getNFTContract, getMarketplaceContract } from "../utils/web3"
import { MARKETPLACE_ADDRESS, NFT_ADDRESS } from "../abi/constants"

export default function Mint() {
  const [image, setImage] = useState(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  async function mintNFT() {
    try {

      await window.ethereum.request({ method: "eth_requestAccounts" })


      if (!image || !name || !description) {
        alert("Please fill all fields")
        return
      }

      setLoading(true)

      // 1️⃣ Upload image to Pinata
      const imageUrl = await uploadFileToIPFS(image)

      // 2️⃣ Upload metadata to Pinata
      const metadataUrl = await uploadMetadata(name, description, imageUrl)

      // 3️⃣ Get contracts
      const nft = await getNFTContract(true)
      // const marketplace = await getMarketplaceContract(true)

      // 4️⃣ Mint NFT
      const mintTx = await nft.mint(metadataUrl)
      await mintTx.wait()

      const tokenId = await nft.tokenCount()

      // 5️⃣ Approve marketplace
      const approveTx = await nft.approve(MARKETPLACE_ADDRESS, tokenId)
      await approveTx.wait()

      // 6️⃣ List NFT
      // const listTx = await marketplace.listItem(
      //   NFT_ADDRESS,
      //   tokenId,
      //   ethers.parseEther(price)
      // )
      // await listTx.wait()

      alert("NFT mintd and listed successfully!")
    } catch (error) {
      console.error(error)
      alert("Transaction failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-slate-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl mb-5 text-indigo-400 font-bold">
        mint New NFT
      </h2>

      <input
        type="file"
        onChange={e => setImage(e.target.files[0])}
        className="mb-4"
      />

      <input
        className="w-full p-2 mb-3 bg-slate-700 rounded"
        placeholder="NFT Name"
        onChange={e => setName(e.target.value)}
      />

      <textarea
        className="w-full p-2 mb-3 bg-slate-700 rounded"
        placeholder="Description"
        onChange={e => setDescription(e.target.value)}
      />
{/* 
      <input
        className="w-full p-2 mb-3 bg-slate-700 rounded"
        placeholder="Price in ETH"
        onChange={e => setPrice(e.target.value)}
      /> */}

      <button
        onClick={mintNFT}
        disabled={loading}
        className="w-full bg-indigo-600 py-2 rounded hover:bg-indigo-700 transition"
      >
        {loading ? "Minting..." : "Create NFT"}
      </button>
    </div>
  )
}

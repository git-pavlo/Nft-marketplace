import { useEffect, useState } from "react"
import axios from "axios"
import { ethers } from "ethers"
import { getNFTContract, getMarketplaceContract } from "../utils/web3"
import { MARKETPLACE_ADDRESS, NFT_ADDRESS } from "../abi/constants"

export default function MyNFTs() {
  const [items, setItems] = useState([])
  const [price, setPrice] = useState({})

  async function loadMyNFTs() {
    const nft = await getNFTContract()
    const provider = nft.runner.provider
    const signer = await provider.getSigner()
    const user = await signer.getAddress()

    const total = await nft.tokenCount()
    const results = []

    for (let i = 1; i <= total; i++) {
      try {
        const owner = await nft.ownerOf(i)
        console.log("Token", i, "owner:", owner)
        if (owner.toLowerCase() === user.toLowerCase()) {
          const uri = await nft.tokenURI(i.toString())
          const meta = await axios.get(uri)

          results.push({
            id: i,
            ...meta.data
          })
        }
      } catch (err) {
          console.log("Skipping token", i)
        continue
      }
    }

    setItems(results)
    console.log("My NFTs:", results)

  }

  async function listNFT(tokenId) {
    const nft = await getNFTContract(true)
    const marketplace = await getMarketplaceContract(true)

    // Approve marketplace
    await nft.approve(MARKETPLACE_ADDRESS, tokenId)

    // List NFT
    await marketplace.listItem(
      NFT_ADDRESS,
      tokenId,
      ethers.parseEther(price[tokenId])
    )

    alert("NFT listed!")
    loadMyNFTs()
  }

  useEffect(() => {
    loadMyNFTs()
  }, [])

  return (
    <div className="p-10">
      <h1 className="text-2xl text-indigo-400 mb-6">My NFTs</h1>

      <div className="grid grid-cols-3 gap-6">
        {items.map(nft => (
          <div key={nft.id} className="bg-slate-800 p-4 rounded-xl">
            <img src={nft.image} alt="" className="rounded mb-3" />
            <h3 className="text-indigo-400">{nft.name}</h3>
            <p className="text-sm text-gray-400">{nft.description}</p>

            <input
              placeholder="Price in ETH"
              className="w-full p-2 mt-3 bg-slate-700 rounded"
              onChange={e =>
                setPrice({ ...price, [nft.id]: e.target.value })
              }
            />

            <button
              onClick={() => listNFT(nft.id)}
              className="w-full mt-3 bg-indigo-600 py-2 rounded"
            >
              List for Sale
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

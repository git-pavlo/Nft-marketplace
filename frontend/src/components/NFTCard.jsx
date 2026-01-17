import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { ethers } from "ethers"
import { getMarketplaceContract, getNFTContract } from "../utils/web3"



export default function NFTCard({ nft, reload }) {
  const navigate = useNavigate()
  const [meta, setMeta] = useState(null)
  const [account, setAccount] = useState("")
  const [newPrice, setNewPrice] = useState("")
  const [price, setPrice] = useState(nft.price) // local live price

  useEffect(() => {
    loadMetadata()
    loadAccount()
  }, [])

  async function loadAccount() {
    const [user] = await window.ethereum.request({
      method: "eth_requestAccounts",
    })
    setAccount(user.toLowerCase())
  }

  async function loadMetadata() {
    try {
      const nftContract = await getNFTContract()
      const tokenURI = await nftContract.tokenURI(nft.tokenId.toString())
      const meta = await axios.get(tokenURI)
      setMeta(meta.data)
    } catch (err) {
      console.error("Metadata error:", err)
    }
  }

  async function buy() {
    const marketplace = await getMarketplaceContract(true)
    const tx = await marketplace.buyItem(nft.index, { value: price })
    await tx.wait()
    reload()
  }

  async function cancel() {
    const marketplace = await getMarketplaceContract(true)
    const tx = await marketplace.cancelListing(nft.index)
    await tx.wait()
    reload()
  }

  async function updatePrice() {
    if (!newPrice || Number(newPrice) <= 0) {
      alert("Invalid price")
      return
    }

    const marketplace = await getMarketplaceContract(true)
    const priceInWei = ethers.parseEther(newPrice)

    const tx = await marketplace.updatePrice(nft.index, priceInWei)
    await tx.wait()

    // Update UI immediately
    setPrice(priceInWei)
    setNewPrice("")

    reload()
  }

  if (!meta) {
    return <div className="bg-slate-800 p-4 rounded-xl">Loading...</div>
  }

  const isOwner = account === nft.seller.toLowerCase()

  return (

      <div className="bg-slate-800 p-4 rounded-xl shadow-xl relative">
        {/* Sold badge */}
        {nft.sold && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
            SOLD
          </div>
        )}
        
        {/* 🔥 OWNED BADGE */}
        {isOwner && (
          <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full">
            Owned
          </div>
        )}
    <div
      onClick={() => navigate(`/nft/${nft.nftAddress}/${nft.tokenId}`)}
      className="cursor-pointer"
    >
        <img src={meta.image} alt="" className="rounded mb-3" />

    </div>

        <h3 className="text-indigo-400"> NFT #{nft.tokenId} {meta.name}</h3>
        <p className="text-sm text-gray-400">{meta.description}</p>
        <p className="mt-2">{ethers.formatEther(price)} ETH</p>    
        
        {isOwner ? (
          <>
            <input
              type="text"
              placeholder="New price in ETH"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="mt-2 w-full p-2 rounded bg-slate-700 text-white"
            />

            <button
              onClick={updatePrice}
              className="mt-2 w-full bg-yellow-600 py-2 rounded"
            >
              Change Price
            </button>

            <button
              onClick={cancel}
              className="mt-2 w-full bg-red-600 py-2 rounded"
            >
              Cancel Listing
            </button>
          </>
        ) : (
          <button
            onClick={buy}
            className="mt-3 w-full bg-indigo-600 py-2 rounded"
          >
            Buy
          </button>
        )}
      </div>


  )
}

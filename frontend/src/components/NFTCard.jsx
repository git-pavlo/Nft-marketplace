import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import { motion } from "framer-motion"
import axios from "axios"
import { ethers } from "ethers"
import { getMarketplaceContract, getNFTContract } from "../utils/web3"

export default function NFTCard({ nft, reload, mode }) {
  const navigate = useNavigate()
  const [meta, setMeta] = useState(null)
  const [account, setAccount] = useState("")
  const [newPrice, setNewPrice] = useState("")

  const isMarket = mode === "market"
  const safePrice = isMarket ? nft.price : ethers.parseEther("0")

  const [price, setPrice] = useState(safePrice)
  const [displayPrice, setDisplayPrice] = useState(safePrice)
  const [canceling, setCanceling] = useState(false)

  useEffect(() => {
    if (!isMarket) return
    setPrice(nft.price)
    setDisplayPrice(nft.price)
  }, [nft.price])

  useEffect(() => {
    if (!isMarket) return
    const start = Number(ethers.formatEther(displayPrice))
    const end = Number(ethers.formatEther(price))
    if (start === end) return

    let frame = 0
    const frames = 20
    const step = (end - start) / frames

    const interval = setInterval(() => {
      frame++
      const value = start + step * frame
      setDisplayPrice(ethers.parseEther(value.toFixed(6)))
      if (frame === frames) clearInterval(interval)
    }, 20)

    return () => clearInterval(interval)
  }, [price])

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
    try {
      setCanceling(true)
      const marketplace = await getMarketplaceContract(true)
      const tx = await marketplace.cancelListing(nft.index)
      await tx.wait()
      reload()
    } catch (err) {
      alert("Cancel failed")
    } finally {
      setCanceling(false)
    }
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
    setPrice(priceInWei)
    setNewPrice("")
    reload()
  }

  if (!meta) {
    return (
      <div className="bg-slate-800 p-3 rounded-xl animate-pulse scale-75">
        <div className="h-32 bg-slate-700 rounded mb-3"></div>
        <div className="h-4 bg-slate-700 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-slate-700 rounded w-1/2"></div>
      </div>
    )
  }

  const isOwner =
    mode === "market"
      ? account === nft.seller?.toLowerCase()
      : true

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className="bg-slate-800 p-3 rounded-xl shadow-xl relative hover:shadow-indigo-500/40 hover:border hover:border-indigo-500 transition-all scale-75"
    >
      {/* SOLD badge */}
      {nft.sold && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
          SOLD
        </div>
      )}

      {/* OWNED badge */}
      {isOwner && (
        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs px-3 py-1 rounded-full">
          Owned
        </div>
      )}

      {/* NFT Image */}
      <div
        onClick={() => navigate(`/nft/${nft.nftAddress}/${nft.tokenId}`)}
        className="cursor-pointer"
      >
        <div className="mb-3 w-3/4 mx-auto aspect-square overflow-hidden rounded-xl bg-slate-800">
          <img
            src={meta.image}
            className="transition-transform duration-300 hover:scale-110 w-full h-full object-cover"
          />
        </div>
      </div>

      <h3 className="text-indigo-400 text-sm md:text-base">NFT #{nft.tokenId} {meta.name}</h3>
      <p className="text-xs md:text-sm text-gray-400">{meta.description}</p>

      {isMarket && (
        <p className="mt-1 text-lg font-bold text-indigo-400">
          {ethers.formatEther(displayPrice)} ETH
        </p>
      )}

      {/* MARKETPLACE MODE */}
      {mode === "market" && (
        isOwner ? (
          <>
            <input
              type="text"
              placeholder="New price in ETH"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="mt-2 p-2 rounded bg-slate-700 text-white w-[48%] mr-[2%]"
            />
            <button
              onClick={updatePrice}
              className="mt-2 w-[48%] ml-[2%] py-2.5 rounded-xl font-semibold text-black bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-amber-500 hover:to-yellow-400 shadow-lg shadow-yellow-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-95"
            >
              💰 Change Price
            </button>

            <motion.button
              onClick={cancel}
              disabled={canceling}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`mt-2 w-full py-2 rounded font-bold ${canceling ? "bg-gray-600" : "bg-red-600 hover:bg-red-700"}`}
            >
              {canceling ? "Canceling..." : "Cancel Listing"}
            </motion.button>
          </>
        ) : (
          <motion.button
            onClick={buy}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-3 w-full bg-indigo-600 py-2 rounded font-bold hover:bg-indigo-700"
          >
            Buy
          </motion.button>
        )
      )}

      {/* WALLET MODE */}
      {mode === "wallet" && (
        <>
          <input
            placeholder="Price in ETH"
            className="w-full p-2 mt-3 bg-slate-700 rounded text-sm"
            onChange={e => nft.setPrice(nft.tokenId, e.target.value)}
          />
          <button
            onClick={() => nft.listNFT(nft.tokenId)}
            className="w-full mt-3 bg-indigo-600 py-2 rounded hover:bg-indigo-700 text-sm"
          >
            List for Sale
          </button>
        </>
      )}
    </motion.div>
  )
}

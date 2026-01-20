import { useEffect, useState } from "react"
import { ethers } from "ethers"
import axios from "axios"
import { getMarketplaceContract, getNFTContract } from "../utils/web3"
import NFTCard from "../components/NFTCard"
import { motion } from "framer-motion"

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [sales, setSales] = useState([])
  const [floorPrice, setFloorPrice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [highestSale, setHighestSale] = useState(null)

  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [sort, setSort] = useState("newest")
  const [search, setSearch] = useState("")

  /* ---------------- LOAD NFTS ---------------- */
  async function loadMarketplaceNFTs() {
    try {
      const marketplace = await getMarketplaceContract()
      const data = await marketplace.getAllListings()

      const formatted = await Promise.all(
        data.map(async (item, index) => {
          const sold = await marketplace.isSold(item[2], item[3])

          const nftContract = await getNFTContract()
          const uri = await nftContract.tokenURI(item[3].toString())
          const meta = await axios.get(uri)

          return {
            seller: item[0],
            price: item[1],
            nftAddress: item[2],
            tokenId: item[3],
            index,
            sold,
            name: meta.data.name,
          }
         
        })
      )

      setNfts(formatted)

      const active = formatted.filter(n => !n.sold)
      if (active.length > 0) {
        const min = active.reduce((a, b) =>
          BigInt(a.price) < BigInt(b.price) ? a : b
        )
        setFloorPrice(min.price)
      } else {
        setFloorPrice(null)
      }
    } catch (err) {
      console.error("Marketplace load error:", err)
    }

    setLoading(false)
  }

  /* ---------------- FILTER + SORT ---------------- */
  const filteredNFTs = nfts
    .filter(nft => {
      const price = nft.price ?? 0n
      const min = minPrice ? ethers.parseEther(minPrice) : null
      const max = maxPrice ? ethers.parseEther(maxPrice) : null

      if (min && price < min) return false
      if (max && price > max) return false
      if (search && !nft.name?.toLowerCase().includes(search.toLowerCase()))
        return false

      return true
    })
    .sort((a, b) => {
      if (sort === "low") return a.price - b.price
      if (sort === "high") return b.price - a.price
      return Number(b.tokenId) - Number(a.tokenId)
    })

  /* ---------------- LOAD SALES ---------------- */
  async function loadSales() {
    const marketplace = await getMarketplaceContract()
    const data = await marketplace.getSales()

    const formatted = data.map(s => ({
      seller: s[0],
      buyer: s[1],
      nft: s[2],
      tokenId: s[3],
      price: s[4],
      time: Number(s[5]),
    }))

    setSales(formatted)

    if (formatted.length > 0) {
      const max = formatted.reduce((a, b) =>
        BigInt(a.price) > BigInt(b.price) ? a : b
      )
      setHighestSale(max.price)
    }
  }

  useEffect(() => {
    loadMarketplaceNFTs()
    loadSales()
  }, [])

  if (loading) {
    return <div className="p-6 text-xl">Loading marketplace...</div>
  }

  /* =================== UI =================== */
  return (
    <div className="pt-24 min-h-screen">
      <div className="Home-header flex-1" >
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{
              opacity: 1,
              y: 0,
              textShadow: [
                "0 0 10px rgba(99,102,241,0.4)",
                "0 0 20px rgba(168,85,247,0.6)",
                "0 0 10px rgba(99,102,241,0.4)",
              ],
            }}
            className="
              text-3xl md:text-5xl font-extrabold mb-4 ml-10 text-center
              bg-clip-text text-cyan-300
            "
          >
            Marketplace
          </motion.h2>


          {floorPrice && (
            <motion.p
              key={floorPrice.toString()}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              className="text-lg font-bold text-emerald-400 mr-10"
              style={{textAlign:"right"}}
            >
              {/* Floor price: {ethers.formatEther(floorPrice)} ETH */}
            </motion.p>
          )}        
      </div>
      <hr />

      {/* MAIN LAYOUT */}
      <div className="flex">

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 pt-0">


          {/* NFT GRID */}
          <div className="flex flex-wrap gap-10  p-4 pt-8">
            {filteredNFTs.length > 0 ? (
              filteredNFTs.map(nft => (
                <NFTCard
                  key={`${nft.nftAddress}-${nft.tokenId}`}
                  nft={nft}
                  reload={loadMarketplaceNFTs}
                  mode="market"
                />
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-400">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-xl font-semibold">No NFTs found</p>
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  )
}

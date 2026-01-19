import { useEffect, useState } from "react"
import { ethers } from "ethers"
import axios from "axios"
import { getMarketplaceContract, getNFTContract } from "../utils/web3"
import NFTCard from "../components/NFTCard"
import Sidebar from "../components/Sidebar"
import { motion } from "framer-motion"

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [sales, setSales] = useState([])
  const [floorPrice, setFloorPrice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [highestSale, setHighestSale] = useState(null)

  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [hideSold, setHideSold] = useState(false)
  const [sort, setSort] = useState("newest")
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")

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
            category: meta.data.category,
          }
         
        })
      )
      // console.log("category",category)
      // console.log(filteredNFTs.length)
      // if (!category && filteredNFTs.length > 0) {
      //   alert("Please select a category")
      //   return
      // }

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

      if (category && nft.category !== category) return false
      if (hideSold && nft.sold) return false
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
              Floor price: {ethers.formatEther(floorPrice)} ETH
            </motion.p>
          )}        
      </div>
      <hr />

      {/* MAIN LAYOUT */}
      <div className="flex">

        {/* ASIDE */}
        <aside className="shrink-0">
          <Sidebar selected={category} setSelected={setCategory} />
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 pt-0">



          {/* FILTER BAR */}
          <div className="bg-slate-900 p-4 rounded-xl mb-6 flex flex-wrap gap-4 items-center">

            <input
              placeholder="Search NFT name..."
              className="bg-slate-700 p-2 rounded w-64"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <input
              placeholder="Min ETH"
              className="bg-slate-700 p-2 rounded w-28"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
            />

            <input
              placeholder="Max ETH"
              className="bg-slate-700 p-2 rounded w-28"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
            />

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={hideSold}
                onChange={e => setHideSold(e.target.checked)}
              />
              Hide sold
            </label>

            <div className="flex items-center gap-2 bg-slate-800 px-3 py-2 rounded-lg">
              <span className="text-gray-400">Sort:</span>

              <button
                onClick={() => setSort("low")}
                className={`px-3 py-1 rounded ${sort === "low"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-700"}`}
              >
                Price ↑
              </button>

              <button
                onClick={() => setSort("high")}
                className={`px-3 py-1 rounded ${sort === "high"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-700"}`}
              >
                Price ↓
              </button>
            </div>
          </div>

          {/* NFT GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <p>Try changing your filters or category</p>
              </div>
            )}
          </div>

          {/* SOLD HISTORY */}
          <h2 className="text-2xl font-bold mt-12 mb-4">Sold History</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sales.map((s, i) => (
              <div key={i} className="bg-slate-900 p-4 rounded-xl relative">
                <div className="absolute top-2 right-2 bg-red-600 text-xs px-2 py-1 rounded">
                  SOLD
                </div>

                {highestSale && BigInt(s.price) === BigInt(highestSale) && (
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs px-3 py-1 rounded">
                    Highest Sale
                  </div>
                )}

                <p className="text-indigo-400">NFT #{s.tokenId}</p>
                <p>{ethers.formatEther(s.price)} ETH</p>
                <p className="text-sm text-gray-400">
                  Buyer {s.buyer.slice(0, 6)}...{s.buyer.slice(-4)}
                </p>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  )
}

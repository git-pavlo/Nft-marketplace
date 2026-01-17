import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { getMarketplaceContract } from "../utils/web3"
import NFTCard from "../components/NFTCard"

export default function Home() {
  const [nfts, setNfts] = useState([])
  const [sales, setSales] = useState([])
  const [floorPrice, setFloorPrice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [highestSale, setHighestSale] = useState(null)

  async function loadMarketplaceNFTs() {
    try {
      const marketplace = await getMarketplaceContract()
      const data = await marketplace.getAllListings()

      const formatted = await Promise.all(
        data.map(async (item, index) => {
          const sold = await marketplace.isSold(item[2], item[3])

          return {
            seller: item[0],
            price: item[1],
            nftAddress: item[2],
            tokenId: item[3],
            index,
            sold,
          }
        })
      )

      const filtered = formatted.filter(
        nft => nft.tokenId && nft.price && nft.price > 0n
      )

      setNfts(filtered)

      // Floor price
      if (filtered.length > 0) {
        const prices = filtered.map(nft => nft.price)
        const min = prices.reduce((a, b) => (a < b ? a : b))
        setFloorPrice(min)
      } else {
        setFloorPrice(null)
      }

    } catch (err) {
      console.error("Marketplace load error:", err)
    }

    setLoading(false)
  }

  async function loadSales() {
    const marketplace = await getMarketplaceContract()
    const data = await marketplace.getSales()

    const formatted = data.map(s => ({
      seller: s[0],
      buyer: s[1],
      nft: s[2],
      tokenId: s[3],
      price: s[4],
      time: Number(s[5])
    }))

    setSales(formatted)

    if (formatted.length > 0) {
      const max = formatted.reduce((a, b) =>
        a.price > b.price ? a : b
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

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">NFT Marketplace</h2>

      {floorPrice && (
        <p className="text-gray-400 mb-6">
          Floor price: {ethers.formatEther(floorPrice)} ETH
        </p>
      )}      

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {nfts.length > 0 ? (
          nfts.map((nft, i) => <NFTCard key={i} nft={nft} reload={loadMarketplaceNFTs} />)
        ) : (
          <p>No NFTs for sale</p>
        )}
      </div>

      <h2 className="text-2xl font-bold mt-10 mb-4">Sold History</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sales.map((s, i) => (
          <div key={i} className="bg-slate-900 p-4 rounded-xl border border-slate-700 relative">
            
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              SOLD
            </div>     

            {highestSale === s.price && (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs font-bold px-3 py-1 rounded shadow-md">
              🏆 Highest Sale
            </div>
            )}           

            <p className="text-indigo-400">
              NFT #{s.tokenId}
            </p>
            <p>{ethers.formatEther(s.price)} ETH</p>
            <p className="text-sm text-gray-400">
              Bought by {s.buyer.slice(0,6)}...{s.buyer.slice(-4)}
            </p>
            <p className="text-xs text-gray-500">
              {new Date(s.time * 1000).toLocaleString()}
            </p>
          </div>
        ))}
      </div>


    </div>
  )
}

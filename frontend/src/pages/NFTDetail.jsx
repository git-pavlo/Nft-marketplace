import { useEffect, useState, useMemo } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { ethers } from "ethers"
import { getMarketplaceContract, getNFTContract } from "../utils/web3"
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts"
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"



function TradeDot({ cx, cy, payload }) {
  if (!cx || !cy) return null
  if (payload.isHighest) {
    return (
      <circle cx={cx} cy={cy} r={8} fill="#facc15" stroke="black" strokeWidth={2} />
    )
  }

  return (
    <circle cx={cx} cy={cy} r={5} fill="#22c55e" />
  )
}


export default function NFTDetail() {
  const { nft: nftAddress, tokenId } = useParams()
  const navigate = useNavigate()
  const [meta, setMeta] = useState(null)
  const [owner, setOwner] = useState("")
  const [listing, setListing] = useState(null)
  const [account, setAccount] = useState("")
  const [sales, setSales] = useState([])
  const [lastSale, setLastSale] = useState(null)
  const [highestSale, setHighestSale] = useState(null)
  

  useEffect(() => {
    loadSales()
    load()
  }, [])

    const chartData = useMemo(() => {
    return sales.map(s => ({
        time: new Date(s.time * 1000).toLocaleDateString(),
        price: Number(ethers.formatEther(s.price)),
        isHighest: highestSale && s.time === highestSale.time
    }))
    }, [sales, highestSale])

    console.log("chartdata",chartData)

    async function loadSales() {
    const marketplace = await getMarketplaceContract()
    const data = await marketplace.getSales()




    const filtered = data.filter(s =>
        s[2].toLowerCase() === nftAddress.toLowerCase() &&
        s[3].toString() === tokenId.toString()
    )

    const formatted = filtered.map(s => ({
        seller: s[0],
        buyer: s[1],
        nft: s[2],
        tokenId: s[3],
        price: s[4],
        time: Number(s[5])
    }))

    setSales(formatted)

    if (formatted.length > 0) {
        const sorted = [...formatted].sort((a,b) => b.time - a.time)
        setLastSale(sorted[0])

        const highest = formatted.reduce((a,b) => 
        a.price > b.price ? a : b
        )
        setHighestSale(highest)
    }
    }


  async function load() {
    const [user] = await window.ethereum.request({ method: "eth_requestAccounts" })
    setAccount(user.toLowerCase())

    const nft = await getNFTContract(nftAddress)
    const marketplace = await getMarketplaceContract()

    // Load token data
    const uri = await nft.tokenURI(tokenId)
    const meta = await axios.get(uri)
    setMeta(meta.data)

    // Load owner
    const onChainOwner = await nft.ownerOf(tokenId)

    // Find listing
    const listings = await marketplace.getAllListings()
    const item = listings.find(
    l =>
        l.nft.toLowerCase() === nftAddress.toLowerCase() &&
        l.tokenId.toString() === tokenId.toString()
    )

    if (item) {
    // NFT is listed → real owner is seller
    setOwner(item.seller.toLowerCase())
    setListing(item)
    } else {
    // Not listed → real owner is on-chain owner
    setOwner(onChainOwner.toLowerCase())
    }

  }

  if (!meta) {
    return <div className="p-10 text-white">Loading NFT...</div>
  }

  const isOwner = owner === account

  console.log("account:",account)
  console.log(isOwner)
  const isListed = !!listing

  return (
    <div className="p-10 max-w-5xl mx-auto text-white grid grid-cols-1 md:grid-cols-2 gap-10 pt-24 mt-24 relative">

<motion.button
  onClick={() => navigate(-1)}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="
    absolute
    flex items-center gap-2
    bg-slate-800 hover:bg-slate-700
    text-white font-medium
    px-4 py-2 rounded-lg
    border border-slate-600
    shadow-md
    mb-6
  "
>
  <ArrowLeft size={18} />
  Back
</motion.button>
     

      <img src={meta.image} className="rounded-xl shadow-xl" />

      <div>
        <h1 className="text-3xl font-bold m-2">{meta.name}</h1>
        <hr/>
        <p className="text-gray-400 mt-2">{meta.description}</p>

        <div className="grid grid-cols-3 gap-4 mt-4">

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 text-center">
                <p className="text-gray-400 text-sm">Last Sale</p>
                <p className="text-lg">
                {lastSale ? `${ethers.formatEther(lastSale.price)} ETH` : "—"}
                </p>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 text-center">
                <p className="text-gray-400 text-sm">Highest Sale</p>
                <p className="text-lg">
                {highestSale ? `${ethers.formatEther(highestSale.price)} ETH` : "—"}
                </p>
            </div>

            <div className="bg-slate-900 p-4 rounded-xl border border-slate-700 text-center">
                <p className="text-gray-400 text-sm">Total Sales</p>
                <p className="text-lg">
                {sales.length}
                </p>
            </div>

        </div>

        <div className="mt-10 bg-slate-900 p-6 rounded-xl border border-slate-700">
            <h3 className="text-lg font-bold mb-4">Price History</h3>

            {sales.length === 0 ? (
                <p className="text-gray-400">No sales yet</p>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={<TradeDot />}
                    />
                </LineChart>
                </ResponsiveContainer>
            )}
        </div>



        {/* Status badge */}
        <div className="mt-4">
          {isListed ? (
            <span className="bg-green-600 px-3 py-1 rounded text-sm">For Sale</span>
          ) : (
            <span className="bg-gray-600 px-3 py-1 rounded text-sm">Not Listed</span>
          )}

          {isOwner && (
            <span className="ml-2 bg-indigo-600 px-3 py-1 rounded text-sm">Owned</span>
          )}
        </div>

        {isListed && (
          <p className="mt-4 text-xl">
            Price: {ethers.formatEther(listing.price)} ETH
          </p>
        )}
      </div>

    </div>
  )
}

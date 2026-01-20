import { useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { ethers } from "ethers"
import { getNFTContract, getMarketplaceContract } from "../utils/web3"
import { MARKETPLACE_ADDRESS, NFT_ADDRESS } from "../utils/constants"
import NFTCard from "../components/NFTCard"
import { motion } from "framer-motion"

export default function Home() {
  // const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [price, setPrice] = useState({})

  async function loadAllNFTs() {
  const nft = await getNFTContract()
  const total = await nft.tokenCount()

  const results = []

  for (let i = 1; i <= total; i++) {
    try {
      const user = await nft.ownerOf(i)
      const uri = await nft.tokenURI(i)
      const meta = await axios.get(uri)

      results.push({
        id: i,
        user,
        ...meta.data
      })
    } catch ( err) {
      console.log("Skipping token", i)
    }
  }

  setItems(results)
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
    loadAllNFTs()
  }, [])

  return (
    <div className="p-10 pt-24">
          <motion.h1
            // initial={{ opacity: 0, y: -20 }}
            // animate={{
            //   opacity: 1,
            //   y: 0,
            //   textShadow: [
            //     "0 0 10px rgba(99,102,241,0.4)",
            //     "0 0 20px rgba(168,85,247,0.6)",
            //     "0 0 10px rgba(99,102,241,0.4)",
            //   ],
            // }}
            className="
              text-3xl md:text-5xl font-extrabold mb-12 ml-10 text-center
              bg-clip-text text-cyan-300
            "
          >
            Home
          </motion.h1>
          <hr />
      <div className="flex flex-wrap gap-10  p-4 pt-8 ">
        {items.map(nft => (
          <NFTCard
            key={nft.id}
            nft={{
              ...nft,
              tokenId: nft.id,
              setPrice: (id, val) => setPrice({ ...price, [id]: val }),
              listNFT
            }}
            reload={loadAllNFTs}
            mode="all"
          />
          ))}
      </div>

    </div>
  )
}

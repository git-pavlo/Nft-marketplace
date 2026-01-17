import { useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ethers } from "ethers"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Mint from "./pages/MintNFT"
import MyNFTs from "./pages/MyNFTs.jsx"
// import NFTDetail from "./pages/NFTDetail.jsx"

function App() {
  const [account, setAccount] = useState(null)

  async function connectWallet() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const accounts = await provider.send("eth_requestAccounts", [])
    setAccount(accounts[0])
  }

  return (
    <>
      <Navbar account={account} connectWallet={connectWallet} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mint" element={<Mint />} />
        <Route path="/my-nfts" element={<MyNFTs />} />
        {/* <Route path="/nft/:nft/:tokenId" element={<NFTDetail />} /> */}
      </Routes>
    </>
  )
}

export default App

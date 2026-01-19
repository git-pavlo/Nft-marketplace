import { useState } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { ethers } from "ethers"
import { AnimatePresence, motion } from "framer-motion"

import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Mint from "./pages/Mint"
import MyNFTs from "./pages/MyNFTs.jsx"
// import NFTDetail from "./pages/NFTDetail.jsx"

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            // <motion.div
            //   initial={{ opacity: 0, y: 20 }}
            //   animate={{ opacity: 1, y: 0 }}
            //   exit={{ opacity: 0, y: -20 }}
            //   transition={{ duration: 0.3 }}
            // >
              <Home />
            //   </motion.div> 
          }
        />

        <Route
          path="/mint"
          element={
          //   <motion.div
          //     initial={{ opacity: 0, x: 50 }}
          //     animate={{ opacity: 1, x: 0 }}
          //     exit={{ opacity: 0, x: -50 }}
          //     transition={{ duration: 0.3 }}
          //   >
              <Mint />
          //   </motion.div>
          }
        />

        <Route
          path="/myNfts"
          element={
            // <motion.div
            //   initial={{ opacity: 0, y: 30 }}
            //   animate={{ opacity: 1, y: 0 }}
            //   exit={{ opacity: 0 }}
            //   transition={{ duration: 0.3 }}
            // >
              <MyNFTs />
            // </motion.div>
          }
        />

        {/* <Route
          path="/nft/:nft/:tokenId"
          element={
            // <motion.div
            //   initial={{ opacity: 0, scale: 0.95 }}
            //   animate={{ opacity: 1, scale: 1 }}
            //   exit={{ opacity: 0 }}
            //   transition={{ duration: 0.3 }}
            // >
              <NFTDetail />
            // </motion.div>
          }
        /> */}
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  const [account, setAccount] = useState(null)

  async function connectWallet() {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const accounts = await provider.send("eth_requestAccounts", [])
    setAccount(accounts[0])
  }

  return (
    <BrowserRouter>
      <Navbar account={account} connectWallet={connectWallet} />
      <AnimatedRoutes />
    </BrowserRouter>
  )
}

export default App

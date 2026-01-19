import { NavLink } from "react-router-dom"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Logo from "./Logo"

const navItems = [
  { name: "Home", path: "/" },
  { name: "Marketplace", path: "/marketplace" },
  { name: "My NFTs", path: "/myNfts" },
  { name: "Mint", path: "/mint" },
]

export default function Navbar() {
  const [account, setAccount] = useState("")

  async function connectWallet() {
    const [addr] = await window.ethereum.request({
      method: "eth_requestAccounts",
    })
    setAccount(addr)
  }

  useEffect(() => {
    if (!window.ethereum) return

    window.ethereum.request({ method: "eth_accounts" }).then(accounts => {
      if (accounts.length) setAccount(accounts[0])
    })
  }, [])

  return (
    <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-3 items-center">

        <Logo/>
        {/* 🔗 Center links */}
        <div className="flex justify-center gap-12">
          {navItems.map((item) => (
            <NavLink key={item.path} to={item.path}>
              {({ isActive }) => (
                <motion.div whileHover={{ scale: 1.1 }} className="relative">
                  <span
                    className={`text-lg transition
                      ${isActive
                        ? "text-indigo-400"
                        : "text-gray-400 hover:text-white"
                      }`}
                  >
                    {item.name}
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute -bottom-2 left-0 right-0 h-[2px] bg-indigo-500 rounded-full shadow-md shadow-indigo-500/50"
                    />
                  )}
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>

        {/*  Wallet */}
        <div className="flex justify-end">
          {account ? (
            <div className="bg-slate-800 px-4 py-2 rounded-xl border border-indigo-500 text-indigo-400 font-mono text-sm shadow-indigo-500/30 shadow">
              {account.slice(0, 6)}...{account.slice(-4)}
            </div>
          ) : (
            <motion.button
              onClick={connectWallet}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 text-sm font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Connect Wallet
            </motion.button>
          )}
        </div>

      </div>
    </nav>
  )
}

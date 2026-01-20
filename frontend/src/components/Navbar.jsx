import { NavLink } from "react-router-dom"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
// import Logo from "./Logo"

const navItems = [
  {
      id: 1,
      path: "/",
      name: 'Home',
      color: 'from-pink-500 to-rose-500',
    },
    {
      id: 2,
      path: "/myNfts",
      name: 'My NFT',
      color: 'from-purple-500 to-indigo-500',
    },
    {
      id: 3,
      path: "/marketplace",
      name: 'Marketplace',
      color: 'from-blue-500 to-cyan-500',
    },{
      id: 4,
      path: "/mint",
      name: 'Mint',
      color: 'from-blue-500 to-cyan-500',
    },
]

export default function Navbar() {
  const [account, setAccount] = useState("")

  const customCss = `
    @property --angle {
      syntax: '<angle>';
      initial-value: 0deg;
      inherits: false;
    }

    @keyframes shimmer-spin {
      to {
        --angle: 360deg;
      }
    }
  `;

  
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAccount(accounts[0]);
  };

  useEffect(() => {
    if (!window.ethereum) return

    window.ethereum.request({ method: "eth_accounts" }).then(accounts => {
      if (accounts.length) setAccount(accounts[0])
    })
  }, [])

  return (
    <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-50 shadow-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-2 items-center">

        {/* <Logo/> */}
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
            <>
            <motion.div className="flex items-center justify-center font-sans">
              <style>{customCss}</style>
              <motion.button onClick={connectWallet} className="relative inline-flex items-center justify-center p-[1.5px] bg-gray-300 dark:bg-black rounded-full overflow-hidden group">
                <div className="absolute inset-0" style={{
                  background: 'conic-gradient(from var(--angle), transparent 15%, #100cdb, transparent 80%)',
                  animation: 'shimmer-spin 2.5s linear infinite'
                }} />
                <span className="relative z-10 inline-flex items-center justify-center w-full h-full px-4 py-2 text-gray-900 dark:text-white bg-emerald-600 dark:bg-gray-900 rounded-full hover:bg-emerald-700 dark:group-hover:bg-gray-800 transition-colors duration-300 ">
                  Connect Wallet
                </span>
              </motion.button>
            </motion.div>
            </>
          )}
        </div>

      </div>
    </nav>
  )
}

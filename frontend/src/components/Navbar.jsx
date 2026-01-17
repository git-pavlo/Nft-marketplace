import { Link } from "react-router-dom"

export default function Navbar({ account, connectWallet }) {
  return (
    <div className="flex justify-between items-center px-10 py-4 bg-slate-900">
      <h1 className="text-2xl font-bold text-indigo-400">
        NFT Marketplace
      </h1>

      <div className="flex gap-6 items-center">
        <Link to="/" className="hover:text-indigo-400">Home</Link>
        <Link to="/mint" className="hover:text-indigo-400">Create</Link>
        <Link to="/my-nfts" className="hover:text-indigo-400">My NFTs</Link>

        {account ? (
          <span className="text-green-400">
            {account.slice(0,6)}...{account.slice(-4)}
          </span>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-indigo-600 px-4 py-2 rounded"
          >
            Connect
          </button>
        )}
      </div>
    </div>
  )
}

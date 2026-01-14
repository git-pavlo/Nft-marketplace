import React from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';

const Navbar = ({ account, setAccount }) => {
  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
    } else {
      alert("Please install MetaMask!");
    }
  };

  return (
    <nav style={styles.nav} className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="flex gap-4">
        <Link to="/" className="hover:text-gray-300">Home</Link>
        <Link to="/my-nfts" className="hover:text-gray-300">My NFTs</Link>
        <Link to="/mint" className="hover:text-gray-300">Mint</Link>
        <Link to="/marketplace" className="hover:text-gray-300">Marketplace</Link>
        <Link to="/send" className="hover:text-gray-300">Send</Link>
      </div>
      <div>
        {account ? (
          <button className="px-4 py-2 bg-red-600 rounded">
            {account.slice(0, 6)}...{account.slice(-4)}
          </button>
        ) : (
          <button onClick={connectWallet} className="px-4 py-2 bg-green-600 rounded">
            Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
    background: "rgba(0,0,0,0.6)",
    color: "white",
  },
};

export default Navbar;

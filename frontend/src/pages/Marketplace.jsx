import React, { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";

function Marketplace({ contractAddress }) {
  const [account, setAccount] = useState(null); // optional wallet connection
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Connect wallet (optional)
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("MetaMask not detected!");
      return;
    }
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);
  };

  // Load NFTs from contract
  const loadMarketplace = useCallback(async () => {
    if (!window.ethereum) return;

    setLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, NFTMarketplace.abi, provider);
      const data = await contract.fetchMarketItems(); // fetch items from contract
      setItems(data);
    } catch (err) {
      console.error("Failed to load marketplace:", err);
    } finally {
      setLoading(false);
    }
  }, [contractAddress]);

  // useEffect calls loadMarketplace safely
  useEffect(() => {
    loadMarketplace();
  }, [loadMarketplace]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>NFT Marketplace</h2>

      {!account && (
        <button onClick={connectWallet} style={{ marginBottom: "1rem" }}>
          Connect Wallet
        </button>
      )}

      {loading ? (
        <p>Loading NFTs...</p>
      ) : items.length === 0 ? (
        <p>No NFTs found.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          {items.map((item, idx) => (
            <div key={idx} style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}>
              <p><strong>{item.name || "Unnamed NFT"}</strong></p>
              <p>Price: {item.price ? ethers.utils.formatEther(item.price) + " ETH" : "N/A"}</p>
              {/* optional: display image if stored in metadata */}
              {item.image && <img src={item.image} alt={item.name} style={{ width: "100%", borderRadius: "8px" }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Marketplace;

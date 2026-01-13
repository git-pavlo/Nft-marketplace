import React from "react";
import { ethers } from "ethers";

const ConnectWallet = ({ onConnected }) => {
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert("MetaMask not detected");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const account = accounts[0];

      onConnected(account, provider);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  return (
    <button
      onClick={connectWallet}
      style={{
        padding: "10px 16px",
        background: "#4f46e5",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
      }}
    >
      Connect Wallet
    </button>
  );
};

export default ConnectWallet;

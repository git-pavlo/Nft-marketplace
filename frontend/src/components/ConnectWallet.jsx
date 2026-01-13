import { ethers } from "ethers";

export default function ConnectWallet({ setAccount }) {
  const connect = async () => {
    if (!window.ethereum) {
      alert("MetaMask not installed");
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);

    setAccount(accounts[0]); // ✅ now this exists
  };

  return (
    <button onClick={connect}>
      Connect Wallet
    </button>
  );
}

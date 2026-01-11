import { useState } from "react";
import { ethers } from "ethers";

export default function Header() {
  const [account, setAccount] = useState(null);

  async function connectWallet() {
    if (!window.ethereum) return alert("Install MetaMask");
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    setAccount(await signer.getAddress());
  }

  return (
    <div className="header">
      <button className="connect-wallet" onClick={connectWallet}>
        {account ? account.slice(0, 6) + "..." : "Connect Wallet"}
      </button>

      <div className="title">NFT MARKETPLACE</div>
    </div>
  );
}

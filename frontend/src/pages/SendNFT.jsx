import { useState, useCallback } from "react";
import getContract from "../utils/contract";
import { ethers } from "ethers";

const SendNFT = ({ account }) => {
  const [tokenId, setTokenId] = useState("");
  const [to, setTo] = useState("");
  const [status, setStatus] = useState("");

  const sendNFT = useCallback(async () => {
    if (!account || !tokenId || !to) return alert("Fill all fields");
    try {
      setStatus("Sending NFT...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);

      const tx = await contract.sendNFT(to, parseInt(tokenId));
      await tx.wait();
      setStatus(`NFT ${tokenId} sent to ${to}`);
      setTokenId("");
      setTo("");
    } catch (err) {
      console.error(err);
      setStatus("Failed to send NFT.");
    }
  }, [account, tokenId, to]);

  return (
    <div>
      <h1 className="text-2xl mb-4">Send NFT</h1>
      <input
        type="text"
        placeholder="Token ID"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
        className="border p-2 mb-2"
      />
      <input
        type="text"
        placeholder="Recipient Address"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        className="border p-2 mb-2"
      />
      <button
        onClick={sendNFT}
        className="px-4 py-2 bg-purple-600 text-white rounded"
      >
        Send NFT
      </button>
      {status && <p className="mt-2">{status}</p>}
    </div>
  );
};

export default SendNFT;

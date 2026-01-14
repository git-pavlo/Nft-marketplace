import { useState, useEffect, useCallback } from "react";
import getContract from "../utils/contract";
import { ethers } from "ethers";

const MyNFTs = ({ account }) => {
  const [myNFTs, setMyNFTs] = useState([]);

  const loadMyNFTs = useCallback(async () => {
    if (!account) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = getContract(provider);
      const tokens = await contract.getMyNFTs(account);
      setMyNFTs(tokens);
    } catch (err) {
      console.error(err);
    }
  }, [account]);

  useEffect(() => {
    loadMyNFTs();
  }, [loadMyNFTs]);

  return (
    <div>
      <h1 className="text-2xl mb-4">My NFTs</h1>
      {myNFTs.length === 0 && <p>You don’t own any NFTs yet.</p>}
      <div className="grid grid-cols-3 gap-4">
        {myNFTs.map((tokenId) => (
          <div key={tokenId} className="p-4 border rounded">
            <p>NFT ID: {tokenId}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyNFTs;

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import getContract from "../utils/contract";

const Home = ({ account }) => {
  const [nfts, setNFTs] = useState([]);

  const loadNFTs = useCallback(async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = getContract(provider);
      const total = await contract.tokenCounter();
      const nftList = [];
      for (let i = 1; i <= total; i++) {
        const owner = await contract.ownerOf(i);
        nftList.push({ tokenId: i, owner });
      }
      setNFTs(nftList);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadNFTs();
  }, [loadNFTs]);

  return (
    <div>
      <h1 className="text-2xl mb-4">All NFTs</h1>
      <div className="grid grid-cols-3 gap-4">
        {nfts.map((nft) => (
          <div key={nft.tokenId} className="p-4 border rounded">
            <p>NFT ID: {nft.tokenId}</p>
            <p>Owner: {nft.owner}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

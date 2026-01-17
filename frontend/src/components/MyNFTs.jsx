import { useEffect, useState } from "react";
import { ethers } from "ethers";
import NFT from "../abi/NFT.json";
import axios from "axios";

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

export default function MyNFTs({ account }) {
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    if (!account) return;

    const loadNFTs = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, NFT.abi, provider);

      const balance = await contract.balanceOf(account);
      let items = [];

      for (let i = 0; i < balance; i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(account, i);
        const tokenURI = await contract.tokenURI(tokenId);
        const meta = await axios.get(tokenURI);

        items.push(meta.data);
      }

      setNfts(items);
    };

    loadNFTs();
  }, [account]);

  return (
    <div>
      {nfts.map((nft, i) => (
        <div key={i}>
          <img src={nft.image} alt={nft.name} width="200" />
          <h3>{nft.name}</h3>
          <p>{nft.description}</p>
        </div>
      ))}
    </div>
  );
}

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";

export function useOwner(contractAddress) {
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    const fetchOwner = async () => {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, NFTMarketplace.abi, provider);
        const _owner = await contract.owner(); // example: your smart contract has an `owner` function
        setOwner(_owner);
      }
    };
    fetchOwner();
  }, [contractAddress]);

  return owner;
}

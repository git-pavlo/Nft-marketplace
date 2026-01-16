import { ethers } from "ethers";
import NFTMarketplace from "./NFTMarketplace.json";

export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

export const getContract = async () => {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(
    CONTRACT_ADDRESS,
    NFTMarketplace.abi,
    signer
  );
};

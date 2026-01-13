import { BrowserProvider, Contract } from "ethers";
import abi from "../NFTMarketplace.json";
import { CONTRACT_ADDRESS } from "../config";

export async function getContract() {
  if (!window.ethereum) throw new Error("MetaMask not installed");

  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new Contract(CONTRACT_ADDRESS, abi.abi, signer);
}

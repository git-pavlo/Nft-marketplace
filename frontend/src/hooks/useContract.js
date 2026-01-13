import { useMemo } from "react";
import { ethers } from "ethers";
import abiJson from "../abi/NFTMarketplace.json";
import { CONTRACT_ADDRESS } from "../config/contract";

export default function useContract(provider) {
  return useMemo(() => {
    if (!provider) return null;
    if (!ethers.isAddress(CONTRACT_ADDRESS)) return null;

    return new ethers.Contract(
      CONTRACT_ADDRESS,
      abiJson.abi,
      provider
    );
  }, [provider]);
}

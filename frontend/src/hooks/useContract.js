import { useEffect, useState } from "react";
import { ethers } from "ethers";
import ABI from "../contracts/NFTMarketplace.json";
import { CONTRACT_ADDRESS } from "../constants/contract";

export default function useContract(account) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    if (!window.ethereum || !account) return;

    const init = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ABI.abi,
        signer
      );

      setProvider(provider);
      setSigner(signer);
      setContract(contract);
    };

    init();
  }, [account]);
  console.log("Contract loaded:", contract?.target);

  return { provider, signer, contract };
}

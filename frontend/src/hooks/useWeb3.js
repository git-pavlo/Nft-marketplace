import { ethers } from "ethers";
import MyNFT from "../contracts/MyNFT.json";
import Marketplace from "../contracts/NFTMarketplace.json";

export async function getContracts() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return {
    nft: new ethers.Contract(
      import.meta.env.VITE_NFT_ADDRESS,
      MyNFT.abi,
      signer
    ),
    market: new ethers.Contract(
      import.meta.env.VITE_MARKET_ADDRESS,
      Marketplace.abi,
      signer
    ),
    account: await signer.getAddress(),
  };
}

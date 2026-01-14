import { ethers } from 'ethers';
import NFTMarketplaceJSON from '../abis/NFTMarketplace.json';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

// ✅ Extract the ABI array properly
const NFTMarketplaceABI = NFTMarketplaceJSON.abi;

const getContract = (signerOrProvider) => {
    console.log(CONTRACT_ADDRESS)
      console.log(NFTMarketplaceABI)
      console.log(signerOrProvider)
  return new ethers.Contract(CONTRACT_ADDRESS, NFTMarketplaceABI, signerOrProvider);
};

export default getContract;


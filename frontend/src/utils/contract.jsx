import { ethers } from 'ethers';
import NFTMarketplaceABI from '../abis/NFTMarketplace.json';

const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

const getContract = (signerOrProvider) => {
  return new ethers.Contract(CONTRACT_ADDRESS, NFTMarketplaceABI, signerOrProvider);
};

export default getContract; // ✅ default export

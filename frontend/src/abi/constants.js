export const NFT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const MARKETPLACE_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export const NFT_ABI = [
  "function mint(string uri) public returns(uint256)",
  "function tokenCount() public view returns(uint256)",
  "function ownerOf(uint256) view returns(address)",
  "function tokenURI(uint256) view returns(string)",
  "function approve(address,uint256)"
]


export const MARKETPLACE_ABI = [
  "function listItem(address,uint,uint)",
  "function buyItem(uint) payable",
  "function cancelListing(uint)",
  "function updatePrice(uint,uint)",
  "function getSales() view returns(tuple(address seller,address buyer,address nft,uint tokenId,uint price,uint timestamp)[])",
  "function getAllListings() view returns(tuple(address seller,uint price,address nft,uint tokenId)[])",
  "function isSold(address,uint) view returns(bool)"
]

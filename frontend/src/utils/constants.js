export const NFT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
export const MARKETPLACE_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

export const NFT_ABI = [
  // ===== ERC721 CORE =====
  "function tokenCount() view returns (uint256)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function approve(address to, uint256 tokenId)",

  // ===== MINTING =====
  "function mint(string _uri) payable returns (uint256)",

  // ===== ANTI-SPAM / COOLDOWN =====
  "function mintFee() view returns (uint256)",
  "function mintCooldown() view returns (uint256)",
  "function lastMintTime(address user) view returns (uint256)",
  "function canMint(address user) view returns (bool)",

  // ===== ADMIN =====
  "function withdraw()"
];

export const MARKETPLACE_ABI = [
  "function listItem(address nft,uint price,uint tokenId)",
  "function buyItem(uint listingId) payable",
  "function cancelListing(uint listingId)",
  "function updatePrice(uint listingId,uint newPrice)",
  "function getSales() view returns(tuple(address seller,address buyer,address nft,uint tokenId,uint price,uint timestamp)[])",
  "function getAllListings() view returns(tuple(address seller,uint price,address nft,uint tokenId)[])",
  "function isSold(address,uint) view returns(bool)"
];

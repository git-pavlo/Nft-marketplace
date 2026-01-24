import { ethers } from "ethers";
import NFTMarketplace from "../abi/NFTMarketplace.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export async function getContract() {
  if (!window.ethereum) throw new Error("MetaMask not installed");

  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new ethers.Contract(CONTRACT_ADDRESS, NFTMarketplace.abi, signer);
}

// Fetch all NFTs with metadata from tokenURI
export async function fetchAllNFTs() {
  const contract = await getContract();
  const total = await contract.totalSupply();

  const nfts = [];

  for (let i = 1; i <= Number(total); i++) {
    try {
      const item = await contract.getNFT(i);
      const owner = await contract.ownerOf(i);
      let tokenURI = await contract.tokenURI(i);

      // Convert ipfs:// → https
      if (tokenURI.startsWith("ipfs://")) {
        tokenURI = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/");
      }

      // Fetch metadata JSON
      let metadata = {};
      try {
        const res = await fetch(tokenURI);
        metadata = await res.json();
      } catch {
        metadata = {};
      }

      // Resolve image
      let image = metadata.image || "";
      if (image.startsWith("ipfs://")) {
        image = image.replace("ipfs://", "https://ipfs.io/ipfs/");
      }

      nfts.push({
        tokenId: i,
        owner,
        seller: item.seller,
        price: item.price,
        forSale: item.forSale,
        tokenURI,
        name: metadata.name || `NFT #${i}`,
        description: metadata.description || "",
        collection: metadata.collection || "Other",
        image,
      });
    } catch (err) {
      console.warn(`Failed to fetch tokenId ${i}`, err);
    }
  }

  return nfts;
}

/**
 * List NFT for sale
 * @param {number} tokenId - The tokenId of the NFT
 * @param {string} priceInEther - Price in ETH (string)
 */
export async function onSellNFT(tokenId, priceInEther) {
  const contract = await getContract();
  const price = ethers.parseEther(priceInEther); // Convert ETH to wei

  try {
    const tx = await contract.listNFT(tokenId, price);
    await tx.wait();
    console.log(`NFT ${tokenId} listed for ${priceInEther} ETH`);
    return true;
  } catch (err) {
    console.error("Failed to list NFT:", err);
    throw err;
  }
}

/**
 * Cancel NFT listing
 * @param {number} tokenId - The tokenId of the NFT
 */
export async function onCancelListing(tokenId) {
  const contract = await getContract();

  try {
    const tx = await contract.cancelSale(tokenId);
    await tx.wait();
    console.log(`Listing cancelled for NFT ${tokenId}`);
    return true;
  } catch (err) {
    console.error("Failed to cancel listing:", err);
    throw err;
  }
}

// ✅ BUY NFT
export async function buyNFT(tokenId, price) {
  const contract = await getContract();

  const tx = await contract.buyNFT(tokenId, {
    value: price,
  });

  await tx.wait();
}

import { ethers } from "ethers";
import NFTMarketplace from "../abi/NFTMarketplace.json";

const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

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

async function getProvider() {
  if (!window.ethereum) throw new Error("MetaMask not installed");
  return new ethers.BrowserProvider(window.ethereum);
}

export async function getTransactionHistory(tokenId) {
  const provider = await getProvider();
  const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    NFTMarketplace.abi,
    provider
  );

  const currentBlock = await provider.getBlockNumber();

  const history = [];

  // 🔹 ERC721 Transfers
  const transferEvents = await contract.queryFilter(
    contract.filters.Transfer(null, null, tokenId),
    0,
    currentBlock
  );

  for (const event of transferEvents) {
    const block = await provider.getBlock(event.blockNumber);

    history.push({
      type: event.args.from === ethers.ZeroAddress ? "mint" : "transfer",
      from: event.args.from,
      to: event.args.to,
      date: new Date(block.timestamp * 1000).toLocaleString(),
    });
  }

  // 🔹 NFT Listed
  if (contract.filters.NFTListed) {
    const listedEvents = await contract.queryFilter(
      contract.filters.NFTListed(tokenId),
      0,
      currentBlock
    );

    for (const event of listedEvents) {
      const block = await provider.getBlock(event.blockNumber);

      history.push({
        type: "sale",
        from: event.args.seller,
        to: "Marketplace",
        price: ethers.formatEther(event.args.price),
        date: new Date(block.timestamp * 1000).toLocaleString(),
      });
    }
  }

  // 🔹 NFT Sold
  if (contract.filters.NFTSold) {
    const soldEvents = await contract.queryFilter(
      contract.filters.NFTSold(tokenId),
      0,
      currentBlock
    );

    for (const event of soldEvents) {
      const block = await provider.getBlock(event.blockNumber);

      history.push({
        type: "sale",
        from: event.args.seller,
        to: event.args.buyer,
        price: ethers.formatEther(event.args.price),
        date: new Date(block.timestamp * 1000).toLocaleString(),
      });
    }
  }

  // Sort oldest → newest
  return history.sort((a, b) => new Date(a.date) - new Date(b.date));
}
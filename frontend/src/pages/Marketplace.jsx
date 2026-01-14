import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";
import getContract from "../utils/contract";

const Marketplace = ({ account }) => {
  const [listings, setListings] = useState([]);
  const [listTokenId, setListTokenId] = useState("");
  const [listPrice, setListPrice] = useState("");
  const [status, setStatus] = useState("");

  const loadListings = useCallback(async () => {
    if (!account) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = getContract(provider);
      const total = await contract.tokenCounter();
      const nftList = [];
      for (let i = 1; i <= total; i++) {
        const listing = await contract.getListing(i);
        if (listing.price > 0) {
          nftList.push({ tokenId: i, price: listing.price, seller: listing.seller });
        }
      }
      setListings(nftList);
    } catch (err) {
      console.error(err);
    }
  }, [account]);

  const listNFT = async () => {
    if (!account || !listTokenId || !listPrice) return alert("Fill all fields");
    try {
      setStatus("Listing NFT...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);

      const tx = await contract.listNFT(parseInt(listTokenId), ethers.parseEther(listPrice));
      await tx.wait();
      setStatus(`NFT ${listTokenId} listed for ${listPrice} ETH`);
      setListTokenId("");
      setListPrice("");
      loadListings();
    } catch (err) {
      console.error(err);
      setStatus("Failed to list NFT.");
    }
  };

  const buyNFT = async (tokenId, price) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);
      const tx = await contract.buyNFT(tokenId, { value: price });
      await tx.wait();
      loadListings();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  return (
    <div>
      <h1 className="text-2xl mb-4">Marketplace</h1>

      <div className="mb-4 border p-4 rounded">
        <h2 className="text-xl mb-2">List Your NFT</h2>
        <input
          type="text"
          placeholder="Token ID"
          value={listTokenId}
          onChange={(e) => setListTokenId(e.target.value)}
          className="border p-2 mb-2"
        />
        <input
          type="text"
          placeholder="Price in ETH"
          value={listPrice}
          onChange={(e) => setListPrice(e.target.value)}
          className="border p-2 mb-2"
        />
        <button
          onClick={listNFT}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          List NFT
        </button>
        {status && <p className="mt-2">{status}</p>}
      </div>

      <h2 className="text-xl mb-2">NFTs for Sale</h2>
      <div className="grid grid-cols-3 gap-4">
        {listings.map((nft) => (
          <div key={nft.tokenId} className="p-4 border rounded">
            <p>NFT ID: {nft.tokenId}</p>
            <p>Price: {ethers.formatEther(nft.price)} ETH</p>
            <p>Seller: {nft.seller}</p>
            <button
              onClick={() => buyNFT(nft.tokenId, nft.price)}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
            >
              Buy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marketplace;

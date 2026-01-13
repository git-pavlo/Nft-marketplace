import React, { useState, useEffect } from "react";
import NFTCard from "../components/NFTCard";

const MyNFTs = ({ contract, account }) => {
  const [myNFTs, setMyNFTs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMyNFTs = async () => {
    if (!contract || !account) return;
    setLoading(true);

    try {
      const total = await contract.tokenCounter();
      const items = [];

      for (let i = 0; i < total; i++) {
        try {
          const nft = await contract.idToNFT(i);
          if (nft.owner.toLowerCase() === account.toLowerCase()) {
            items.push({ id: i, ...nft });
          }
        } catch (err) {
          // skip if NFT does not exist
        }
      }

      setMyNFTs(items);
    } catch (err) {
      console.error("Failed to load NFTs:", err);
    } finally {
      setLoading(false);
    }
  };

  // Send NFT to another wallet
  const sendNFT = async (id) => {
    const to = prompt("Enter recipient wallet address:");
    if (!to) return;

    try {
      const tx = await contract.send(id, to);
      await tx.wait();
      alert("NFT sent!");
      loadMyNFTs();
    } catch (err) {
      console.error(err);
      alert("Send failed: " + err.message);
    }
  };

  // List NFT for sale
  const listNFT = async (id) => {
    const price = prompt("Enter price in wei:");
    if (!price) return;

    try {
      const tx = await contract.list(id, price);
      await tx.wait();
      alert("NFT listed!");
      loadMyNFTs();
    } catch (err) {
      console.error(err);
      alert("Listing failed: " + err.message);
    }
  };

  // Delist NFT
  const delistNFT = async (id) => {
    try {
      const tx = await contract.delist(id);
      await tx.wait();
      alert("NFT delisted!");
      loadMyNFTs();
    } catch (err) {
      console.error(err);
      alert("Delist failed: " + err.message);
    }
  };

  useEffect(() => {
    loadMyNFTs();
  }, [contract, account]);

  if (loading) return <p>Loading your NFTs...</p>;
  if (!myNFTs.length) return <p>You don’t own any NFTs yet.</p>;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
      {myNFTs.map((nft) => (
        <NFTCard
          key={nft.id}
          nft={nft}
          account={account}
          onSend={() => sendNFT(nft.id)}
          onList={() => listNFT(nft.id)}
          onDelist={() => delistNFT(nft.id)}
        />
      ))}
    </div>
  );
};

export default MyNFTs;

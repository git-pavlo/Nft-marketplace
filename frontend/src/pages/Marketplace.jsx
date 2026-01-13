import React, { useEffect, useState } from "react";
import NFTCard from "../components/NFTCard";


const Marketplace = ({ contract }) => {
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contract) return;

    const loadMarketplace = async () => {
      try {
        // CHANGE THIS if your function name is different
        const items = await contract.getListedNFTs();

        setNfts(items);
      } catch (err) {
        console.error("Failed to load marketplace NFTs:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMarketplace();
  }, [contract]);

  if (loading) return <p>Loading marketplace...</p>;

  if (!nfts.length) return <p>No NFTs listed</p>;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "20px" }}>
      {nfts.map((nft, index) => (
        <NFTCard key={index} nft={nft} />
      ))}
    </div>
  );
};

export default Marketplace;

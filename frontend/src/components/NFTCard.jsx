import React from "react";
import { ethers } from "ethers";

const NFTCard = ({ nft }) => {
  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: "12px",
      }}
    >
      <p><strong>Token ID:</strong> {nft.tokenId?.toString()}</p>
      <p>
        <strong>Price:</strong>{" "}
        {ethers.formatEther(nft.price)} ETH
      </p>
      <p style={{ fontSize: "12px", color: "#555" }}>
        Seller: {nft.seller}
      </p>
    </div>
  );
};

export default NFTCard;

import React from "react";

const NFTCard = ({ nft, account, onBuy, onList, onDelist, onSend }) => {
  const isOwner = nft.owner.toLowerCase() === account?.toLowerCase();

  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", width: "250px" }}>
      <img src={nft.tokenURI} alt={nft.name} style={{ width: "100%" }} />
      <h3>{nft.name}</h3>
      <p>{nft.description}</p>
      <p>Price: {nft.price} wei</p>
      <p>Owner: {nft.owner.slice(0, 6)}...</p>

      {!isOwner && nft.forSale && <button onClick={onBuy}>Buy</button>}
      {isOwner && !nft.forSale && <button onClick={onList}>List for Sale</button>}
      {isOwner && nft.forSale && <button onClick={onDelist}>Delist</button>}
      {isOwner && <button onClick={onSend}>Send</button>}
    </div>
  );
};

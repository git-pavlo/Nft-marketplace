import React, { useState } from "react";

const Mint = ({ contract }) => {
  const [tokenURI, setTokenURI] = useState("");
  const [loading, setLoading] = useState(false);

  const mintNFT = async () => {
    if (!contract || !tokenURI) return;

    try {
      setLoading(true);
      const tx = await contract.mint(tokenURI);
      await tx.wait();
      alert("NFT Minted!");
      setTokenURI("");
    } catch (err) {
      console.error("Mint failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h3>Mint NFT (Optional)</h3>
      <input
        value={tokenURI}
        onChange={(e) => setTokenURI(e.target.value)}
        placeholder="Token URI"
        style={{ width: "300px" }}
      />
      <br />
      <button onClick={mintNFT} disabled={loading}>
        {loading ? "Minting..." : "Mint"}
      </button>
    </div>
  );
};

export default Mint;

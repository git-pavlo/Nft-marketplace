import { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { CONTRACT_ADDRESS, ABI } from "../utils/contract";

function MyNFTs() {
  const [nfts, setNfts] = useState([]);
  const [price, setPrice] = useState("");

  useEffect(() => {
    loadMyNFTs();
  }, []);

  const loadMyNFTs = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    const data = await contract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenURI = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenURI);

        return {
          tokenId: Number(i.tokenId),
          price: ethers.formatEther(i.price),
          listed: i.listed,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
      })
    );

    setNfts(items);
  };

  const sellNFT = async (tokenId) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    const listingFee = await contract.listingFee();

    const tx = await contract.listNFT(
      tokenId,
      ethers.parseEther(price),
      { value: listingFee }
    );

    await tx.wait();
    loadMyNFTs();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>My NFTs</h2>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }}>
        {nfts.map((nft) => (
          <div key={nft.tokenId} style={{ border: "1px solid #ddd", padding: "10px" }}>
            <img src={nft.image} width="100%" alt="" />
            <h4>{nft.name}</h4>
            <p>{nft.description}</p>

            {nft.listed ? (
              <p><strong>Listed:</strong> {nft.price} ETH</p>
            ) : (
              <>
                <input
                  placeholder="Price in ETH"
                  onChange={(e) => setPrice(e.target.value)}
                />
                <button onClick={() => sellNFT(nft.tokenId)}>
                  Sell NFT
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyNFTs;

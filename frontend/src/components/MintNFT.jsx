import { useState } from "react";
import { uploadImageToIPFS, uploadMetadataToIPFS } from "../utils/pinata";
import { getContract } from "../utils/contract";

function MintNFT() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const mintNFT = async () => {
    if (!name || !description || !image) {
      alert("All fields required");
      return;
    }

    // 1. Upload image
    const imageUrl = await uploadImageToIPFS(image);

    // 2. Create metadata
    const metadata = {
      name,
      description,
      image: imageUrl,
    };
    console.log("hi3")
    // 3. Upload metadata
    const metadataUrl = await uploadMetadataToIPFS(metadata);
    console.log("hi4")
    // 4. Mint NFT
    const contract = await getContract();
    const tx = await contract.mintNFT(metadataUrl);
    await tx.wait();

    alert("NFT Minted Successfully!");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Mint NFT</h2>

      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <br /><br />

      <textarea
        placeholder="Description"
        onChange={(e) => setDescription(e.target.value)}
      />
      <br /><br />

      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <br /><br />

      <button onClick={mintNFT}>Mint NFT</button>
    </div>
  );
}

export default MintNFT;

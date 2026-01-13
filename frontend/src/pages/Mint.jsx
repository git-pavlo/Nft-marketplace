import { useState } from "react";

export default function Mint({ contract }) {
  const [status, setStatus] = useState("");

  const mint = async () => {
    try {
      const tx = await contract.mint("ipfs://TEST");
      await tx.wait();
      setStatus("Minted ✅");
    } catch (err) {
      console.error(err);
      setStatus("Mint failed ❌");
    }
  };

  return (
    <div>
      <button onClick={mint}>Mint</button>
      <p>{status}</p>
    </div>
  );
}

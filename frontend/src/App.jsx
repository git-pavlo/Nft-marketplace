import React, { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import useContract from "./hooks/useContract";

function App() {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);

  const contract = useContract(provider);

  const handleWalletConnected = (account, provider) => {
    setAccount(account);
    setProvider(provider);
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>NFT Marketplace</h1>

      {!account ? (
        <ConnectWallet onConnected={handleWalletConnected} />
      ) : (
        <>
          <p><strong>Wallet:</strong> {account}</p>
          <p>
            <strong>Contract loaded:</strong>{" "}
            {contract ? "YES ✅" : "NO ❌"}
          </p>
        </>
      )}
    </div>
  );
}

export default App;

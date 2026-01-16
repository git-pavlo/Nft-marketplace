import { useState } from "react";

function Navbar() {
  const [account, setAccount] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAccount(accounts[0]);
  };

  return (
    <div style={styles.nav}>
      <h2>OpenSea Clone</h2>
      <button onClick={connectWallet} style={styles.btn}>
        {account
          ? `${account.slice(0, 6)}...${account.slice(-4)}`
          : "Connect Wallet"}
      </button>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
  },
  btn: {
    padding: "10px 20px",
    cursor: "pointer",
  },
};

export default Navbar;

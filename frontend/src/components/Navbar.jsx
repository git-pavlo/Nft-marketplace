export default function Navbar({ connectWallet, account }) {
  return (
    <div style={styles.nav}>
      <h2>NFT Marketplace</h2>
      <button onClick={connectWallet}>
        {account ? account.slice(0, 6) + "..." : "Connect Wallet"}
      </button>
    </div>
  );
}

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
    background: "rgba(0,0,0,0.6)",
    color: "white",
  },
};

export const HARDHAT_CHAIN_ID = "0x7A69"; // 31337

export async function ensureHardhatNetwork() {
  if (!window.ethereum) return false;

  const chainId = await window.ethereum.request({
    method: "eth_chainId",
  });

  if (chainId !== HARDHAT_CHAIN_ID) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: HARDHAT_CHAIN_ID }],
      });
      return true;
    } catch (err) {
      alert("Please switch MetaMask to Hardhat (localhost)");
      return false;
    }
  }

  return true;
}

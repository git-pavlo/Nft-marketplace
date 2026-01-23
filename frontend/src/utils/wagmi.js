import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia, hardhat } from "wagmi/chains";

const projectId = "d2ec11605dec67f689a5de713b9f882f";

export const config = getDefaultConfig({
  appName: "NFT Marketplace",
  projectId,
  chains: [hardhat, sepolia, mainnet],
});

export const wagmiConfig = config;
export const chains = [hardhat, sepolia, mainnet];

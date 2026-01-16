const hre = require("hardhat");

async function main() {
  const NFT = await hre.ethers.deployContract("NFTMarketplace");
  await NFT.waitForDeployment();

  console.log("NFT Marketplace deployed to:", await NFT.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

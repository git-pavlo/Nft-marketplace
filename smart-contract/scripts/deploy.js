const hre = require("hardhat");

async function main() {
  const NFT = await hre.ethers.deployContract("NFT");
  await NFT.waitForDeployment();

  const Marketplace = await hre.ethers.deployContract("Marketplace");
  await Marketplace.waitForDeployment();

  console.log("NFT:", await NFT.getAddress());
  console.log("Marketplace:", await Marketplace.getAddress());
}

main();
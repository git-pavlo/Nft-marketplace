const hre = require("hardhat");

async function main() {

  const NFTMarketplace = await hre.ethers.deployContract("NFTMarketplace");
  await NFTMarketplace.waitForDeployment();

  console.log("NFTMarketplace:", await NFTMarketplace.getAddress());
}

main();
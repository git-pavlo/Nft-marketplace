const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");

  // Deploy the contract
  const nft = await NFTMarketplace.deploy();
  await nft.deployed();

  console.log("NFTMarketplace deployed to:", nft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

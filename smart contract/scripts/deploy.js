const hre = require("hardhat");

async function main() {
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const nft = await NFTMarketplace.deploy();
  console.log("Deploying contract...");
  await nft.waitForDeployment(); // ethers v6 requires waitForDeployment()
  console.log("NFTMarketplace deployed to:", nft.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

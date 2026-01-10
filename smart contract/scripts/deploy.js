async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with account:", deployer.address);
  
    const MyNFT = await ethers.getContractFactory("MyNFT");
    const nft = await MyNFT.deploy("MyNFT", "MNFT");
    await nft.deployed();
    console.log("MyNFT deployed to:", nft.address);
  
    const Marketplace = await ethers.getContractFactory("NFTMarketplace");
    const marketplace = await Marketplace.deploy();
    await marketplace.deployed();
    console.log("Marketplace deployed to:", marketplace.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  
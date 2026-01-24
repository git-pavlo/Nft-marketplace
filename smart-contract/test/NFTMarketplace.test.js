const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace - Minting", function () {
  let nft, owner, user;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("NFTMarketplace");
    nft = await Factory.deploy();
    await nft.waitForDeployment();
  });

  it("Should mint NFT with tokenURI", async () => {
    const uri = "ipfs://QmExampleMetadataHash";

    await (await nft.connect(user).mintNFT(uri)).wait();

    expect(await nft.ownerOf(1)).to.equal(user.address);
    expect(await nft.tokenURI(1)).to.equal(uri);
  });
});

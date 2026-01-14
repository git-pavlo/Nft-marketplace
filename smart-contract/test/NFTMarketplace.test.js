const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace Full Flow", function () {
  let nft;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    nft = await NFTMarketplace.deploy();
    await nft.waitForDeployment();
  });

  it("Full NFT marketplace workflow", async function () {
    // Mint
    await nft.mint(owner.address, "ipfs://QmHash1");
    await nft.mint(owner.address, "ipfs://QmHash2");

    expect(await nft.ownerOf(1)).to.equal(owner.address);
    expect(await nft.ownerOf(2)).to.equal(owner.address);

    // List
    await nft.listNFT(1, ethers.parseEther("1"));
    await nft.listNFT(2, ethers.parseEther("2"));

    // Buy
    await nft.connect(addr1).buyNFT(1, {
      value: ethers.parseEther("1"),
    });
    expect(await nft.ownerOf(1)).to.equal(addr1.address);

    // Send (correct order!)
    await nft.sendNFT(addr2.address, 2);
    expect(await nft.ownerOf(2)).to.equal(addr2.address);

    // Delist
    await nft.connect(addr1).listNFT(1, ethers.parseEther("1.5"));
    await nft.connect(addr1).delistNFT(1);

    const listing = await nft.getListing(1);
    expect(listing.price).to.equal(0n);
  });
});

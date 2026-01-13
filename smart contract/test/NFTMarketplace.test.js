const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace Full Flow", function () {
  let nft, owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy contract
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    nft = await NFTMarketplace.deploy(); // ethers v6: no .deployed()
  });

  it("Full NFT marketplace workflow", async function () {
    // ----------------------------
    // Mint NFT (owner only)
    // ----------------------------
    await nft.mintNFT("https://token-metadata.com/1");
    await nft.mintNFT("https://token-metadata.com/2");

    expect(await nft.tokenCounter()).to.equal(2);
    expect(await nft.ownerOf(1)).to.equal(owner.address);
    expect(await nft.ownerOf(2)).to.equal(owner.address);

    // ----------------------------
    // Owner lists NFT for sale
    // ----------------------------
    const price1 = ethers.parseEther("1"); // 1 ETH
    const price2 = ethers.parseEther("2"); // 2 ETH

    await nft.sellNFT(1, price1);
    await nft.sellNFT(2, price2);

    expect(await nft.listings(1)).to.equal(price1);
    expect(await nft.listings(2)).to.equal(price2);

    // ----------------------------
    // User1 buys NFT #1
    // ----------------------------
    await nft.connect(user1).buyNFT(1, { value: price1 });
    expect(await nft.ownerOf(1)).to.equal(user1.address);
    expect(await nft.listings(1)).to.equal(0);

    // ----------------------------
    // User1 sends NFT #1 to User2
    // ----------------------------
    await nft.connect(user1).sendNFT(1, user2.address);
    expect(await nft.ownerOf(1)).to.equal(user2.address);

    // ----------------------------
    // Owner delists NFT #2
    // ----------------------------
    await nft.delistNFT(2);
    expect(await nft.listings(2)).to.equal(0);

    // ----------------------------
    // Check myNFTs function
    // ----------------------------
    const ownerNFTs = await nft.getMyNFTs(owner.address);
    const user2NFTs = await nft.getMyNFTs(user2.address);

    expect(ownerNFTs.map((id) => Number(id))).to.deep.equal([2]);
    expect(user2NFTs.map((id) => Number(id))).to.deep.equal([1]);
  });
});

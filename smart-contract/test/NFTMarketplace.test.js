const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", function () {
  let NFTMarketplace, nft, owner, addr1, addr2;

  beforeEach(async function () {
    NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    [owner, addr1, addr2] = await ethers.getSigners();
    nft = await NFTMarketplace.deploy();
    await nft.deployed();
  });

  it("Should mint NFT correctly", async function () {
    const tokenId = await nft.mintNFT(addr1.address);
    expect(await nft.ownerOf(tokenId)).to.equal(addr1.address);
  });

  it("Should list NFT for sale", async function () {
    const tokenId = await nft.mintNFT(addr1.address);
    await nft.connect(addr1).listNFT(tokenId, ethers.utils.parseEther("1"));
    const item = await nft.getNFT(tokenId);
    expect(item.forSale).to.equal(true);
    expect(item.price.toString()).to.equal(ethers.utils.parseEther("1").toString());
  });

  it("Should cancel NFT sale", async function () {
    const tokenId = await nft.mintNFT(addr1.address);
    await nft.connect(addr1).listNFT(tokenId, ethers.utils.parseEther("1"));
    await nft.connect(addr1).cancelSale(tokenId);
    const item = await nft.getNFT(tokenId);
    expect(item.forSale).to.equal(false);
  });

  it("Should buy NFT and transfer ownership", async function () {
    const tokenId = await nft.mintNFT(addr1.address);
    await nft.connect(addr1).listNFT(tokenId, ethers.utils.parseEther("1"));

    const sellerBalanceBefore = await ethers.provider.getBalance(addr1.address);

    await nft.connect(addr2).buyNFT(tokenId, { value: ethers.utils.parseEther("1") });

    expect(await nft.ownerOf(tokenId)).to.equal(addr2.address);

    const sellerBalanceAfter = await ethers.provider.getBalance(addr1.address);
    expect(sellerBalanceAfter.sub(sellerBalanceBefore)).to.equal(ethers.utils.parseEther("1"));

    const item = await nft.getNFT(tokenId);
    expect(item.forSale).to.equal(false);
  });

  it("Should fail if non-owner tries to list NFT", async function () {
    const tokenId = await nft.mintNFT(addr1.address);
    await expect(
      nft.connect(addr2).listNFT(tokenId, ethers.utils.parseEther("1"))
    ).to.be.revertedWith("You are not the owner");
  });

  it("Should fail if buying NFT with insufficient payment", async function () {
    const tokenId = await nft.mintNFT(addr1.address);
    await nft.connect(addr1).listNFT(tokenId, ethers.utils.parseEther("2"));

    await expect(
      nft.connect(addr2).buyNFT(tokenId, { value: ethers.utils.parseEther("1") })
    ).to.be.revertedWith("Insufficient payment");
  });
});

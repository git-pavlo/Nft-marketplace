const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", function () {
  let NFTMarketplace;
  let nft;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    nft = await NFTMarketplace.deploy();
  });

  it("Should allow owner to mint NFT", async function () {
    await nft.mint(owner.address);
    expect(await nft.ownerOf(1)).to.equal(owner.address);
  });

  it("Should not allow non-owner to mint NFT", async function () {
    await expect(nft.connect(addr1).mint(addr1.address)).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });

  it("Should list NFT for sale", async function () {
    await nft.mint(owner.address);
    await nft.listNFT(1, ethers.parseEther("1"));
    const listing = await nft.getListing(1);
    expect(listing.price).to.equal(ethers.parseEther("1"));
    expect(listing.seller).to.equal(owner.address);
  });

  it("Should allow buying NFT", async function () {
    await nft.mint(owner.address);
    await nft.listNFT(1, ethers.parseEther("1"));

    await nft.connect(addr1).buyNFT(1, { value: ethers.parseEther("1") });

    expect(await nft.ownerOf(1)).to.equal(addr1.address);
  });

  it("Should allow sending NFT to another user", async function () {
    await nft.mint(owner.address);
    await nft.sendNFT(addr1.address, 1);
    expect(await nft.ownerOf(1)).to.equal(addr1.address);
  });
});

const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace Full Flow", function () {
  let NFTMarketplace;
  let nft;
  let owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    nft = await NFTMarketplace.deploy(); // ethers v6 automatically waits
  });

  it("Full NFT marketplace workflow", async function () {
    // ---------- Minting ----------
    await nft.mint(owner.address);
    await nft.mint(owner.address);
    expect(await nft.ownerOf(1)).to.equal(owner.address);
    expect(await nft.ownerOf(2)).to.equal(owner.address);

    // ---------- Listing ----------
    await nft.listNFT(1, ethers.parseEther("1"));
    await nft.listNFT(2, ethers.parseEther("2"));

    const listing1 = await nft.getListing(1);
    const listing2 = await nft.getListing(2);
    expect(listing1.price).to.equal(ethers.parseEther("1"));
    expect(listing2.price).to.equal(ethers.parseEther("2"));

    // ---------- Buying ----------
    await nft.connect(addr1).buyNFT(1, { value: ethers.parseEther("1") });
    expect(await nft.ownerOf(1)).to.equal(addr1.address);

    // ---------- Send NFT ----------
    await nft.sendNFT(addr2.address, 2);
    expect(await nft.ownerOf(2)).to.equal(addr2.address);

    // ---------- Delist NFT ----------
    // First list an NFT for addr1
    await nft.connect(addr1).listNFT(1, ethers.parseEther("1.5"));
    let listing = await nft.getListing(1);
    expect(listing.price).to.equal(ethers.parseEther("1.5"));

    // Then delist it
    await nft.connect(addr1).delistNFT(1);
    listing = await nft.getListing(1);
    expect(listing.price).to.equal(0); // delisted

    // ---------- MyNFTs ----------
    const ownerNFTs = await nft.getMyNFTs(owner.address);
    const addr1NFTs = await nft.getMyNFTs(addr1.address);
    const addr2NFTs = await nft.getMyNFTs(addr2.address);

    expect(ownerNFTs.length).to.equal(0); // owner has none left
    expect(addr1NFTs.length).to.equal(1); // owns NFT 1
    expect(addr2NFTs.length).to.equal(1); // owns NFT 2

    // ---------- MyListings ----------
    const addr1Listings = await nft.getMyListings(addr1.address);
    expect(addr1Listings.length).to.equal(0); // delisted NFT 1

    // Re-list NFT 1 and check MyListings again
    await nft.connect(addr1).listNFT(1, ethers.parseEther("3"));
    const updatedListings = await nft.getMyListings(addr1.address);
    expect(updatedListings.length).to.equal(1);
    expect(updatedListings[0].price).to.equal(ethers.parseEther("3"));
  });
});
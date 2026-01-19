const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFT + Marketplace", function () {
  let nft, marketplace;
  let deployer, seller, buyer;

  const URI = "ipfs://test-uri";
  const PRICE = ethers.parseEther("1");

  beforeEach(async () => {
    [deployer, seller, buyer] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("NFT");
    nft = await NFT.deploy();
    await nft.waitForDeployment();

    const Marketplace = await ethers.getContractFactory("Marketplace");
    marketplace = await Marketplace.deploy();
    await marketplace.waitForDeployment();
  });

  it("mints NFT with correct owner and tokenURI", async () => {
    await nft.connect(seller).mint(URI);

    expect(await nft.ownerOf(1)).to.equal(seller.address);
    expect(await nft.tokenURI(1)).to.equal(URI);
  });

  it("lists NFT on marketplace", async () => {
    await nft.connect(seller).mint(URI);

    await nft
      .connect(seller)
      .approve(await marketplace.getAddress(), 1);

    await marketplace.connect(seller).listItem(
      await nft.getAddress(),
      1,
      PRICE
    );

    const listing = await marketplace.allListings(0);

    expect(listing.seller).to.equal(seller.address);
    expect(listing.price.toString()).to.equal(PRICE.toString());
    expect(Number(listing.tokenId)).to.equal(1);
  });

  it("allows buyer to purchase NFT", async () => {
    await nft.connect(seller).mint(URI);

    await nft
      .connect(seller)
      .approve(await marketplace.getAddress(), 1);

    await marketplace.connect(seller).listItem(
      await nft.getAddress(),
      1,
      PRICE
    );

    await marketplace.connect(buyer).buyItem(0, {
      value: PRICE,
    });

    expect(await nft.ownerOf(1)).to.equal(buyer.address);
  });

  it("reverts if wrong ETH amount sent", async () => {
    await nft.connect(seller).mint(URI);

    await nft
      .connect(seller)
      .approve(await marketplace.getAddress(), 1);

    await marketplace.connect(seller).listItem(
      await nft.getAddress(),
      1,
      PRICE
    );

    await expect(
      marketplace.connect(buyer).buyItem(0, {
        value: ethers.parseEther("0.5"),
      })
    ).to.be.revertedWith("Wrong ETH");
  });

  it("allows seller to cancel listing", async () => {
    await nft.connect(seller).mint(URI);

    await nft
      .connect(seller)
      .approve(await marketplace.getAddress(), 1);

    await marketplace.connect(seller).listItem(
      await nft.getAddress(),
      1,
      PRICE
    );

    await marketplace.connect(seller).cancelListing(0);

    expect(await nft.ownerOf(1)).to.equal(seller.address);
  });

  it("reverts cancel if not seller", async () => {
    await nft.connect(seller).mint(URI);

    await nft
      .connect(seller)
      .approve(await marketplace.getAddress(), 1);

    await marketplace.connect(seller).listItem(
      await nft.getAddress(),
      1,
      PRICE
    );

    await expect(
      marketplace.connect(buyer).cancelListing(0)
    ).to.be.revertedWith("Not seller");
  });

  it("reverts if listing price is zero", async () => {
    await nft.connect(seller).mint(URI);

    await nft
      .connect(seller)
      .approve(await marketplace.getAddress(), 1);

    await expect(
      marketplace.connect(seller).listItem(
        await nft.getAddress(),
        1,
        0
      )
    ).to.be.revertedWith("Price must be > 0");
  });
});

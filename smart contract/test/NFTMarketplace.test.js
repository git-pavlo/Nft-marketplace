const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Token contract", function () {
  let token, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    const Token = await ethers.getContractFactory("Token");
    const initialSupply = ethers.parseEther("1000");
    token = await Token.deploy(initialSupply);
    await token.waitForDeployment();
  });

  it("deploys successfully", async function () {
    const Marketplace = await ethers.getContractFactory("NFTMarketplace");
    const marketplace = await Marketplace.deploy();
    await marketplace.waitForDeployment();

    expect(await marketplace.getAddress()).to.not.equal(
      ethers.ZeroAddress
    );
  });

  it("Should assign the total supply of tokens to the deployer", async function () {
    const ownerBalance = await token.balanceOf(owner.address);
    expect(ownerBalance).to.equal(ethers.parseEther("1000"));
  });

  it("Should transfer tokens between accounts", async function () {
    await token.transfer(addr1.address, ethers.parseEther("100"));
    const addr1Balance = await token.balanceOf(addr1.address);
    expect(addr1Balance).to.equal(ethers.parseEther("100"));
  });

  it("Should fail if sender doesn't have enough tokens", async function () {
    await expect(token.connect(addr1).transfer(owner.address, ethers.parseEther("1000")))
      .to.be.reverted;
  });
});

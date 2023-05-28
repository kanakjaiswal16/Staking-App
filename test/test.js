const { expect } = require("chai");
const { ethers } = require("hardhat");
const ABI = require("./ABI.json");

describe("defi", () => {
  let defi;

  beforeEach(async () => {
    const contract = await ethers.getContractFactory("DeFi");
    defi = await contract.deploy();
    await defi.deployed();
    [admin, user] = await ethers.getSigners();
  });

  it("constructor", async () => {
    expect(await defi.owner()).to.equal(
      await await ethers.provider.getSigner(0).getAddress()
    );
    expect(await defi.Staking()).to.equal(true);
  });

  it("mintToken", async () => {
    await defi.connect(user).mintToken("Bayern", "FCB", 1000);
    const t = await defi.connect(user).OwnerToken(user.address);
    const tAddress = t[0];
    const token = await defi.connect(user).tokens(tAddress);
    expect(token.tokenAddress).to.equal(tAddress);
    expect(token.name).to.equal("Bayern");
    expect(token.symbol).to.equal("FCB");
    expect(token.owner).to.equal(user.address);
  });

  it("OwnerToken", async () => {
    await defi.connect(user).mintToken("Bayern", "FCB", 1000);
    const t = await defi.connect(user).OwnerToken(user.address);
    const tAddress = t[0];
    const token = await defi.connect(user).tokens(tAddress);
    expect(token.tokenAddress).to.equal(tAddress);
  });

  it("rewards", async () => {
    expect(await defi.rewards(172800, 100000)).to.equal(200);
  });

  it("getTokenBalance", async () => {
    await defi.connect(user).mintToken("Bayern", "FCB", 1000);
    const t = await defi.connect(user).OwnerToken(user.address);
    const tAddress = t[0];
    const balance = Number(await defi.connect(user).getTokenBalance(tAddress));
    expect(balance).to.equal(1000);
  });

  it("stopStaking", async () => {
    await defi.stopStaking();
    expect(await defi.Staking()).to.equal(false);
  });

  it("startStaking", async () => {
    await defi.startStaking();
    expect(await defi.Staking()).to.equal(true);
  });

  it("Owner", async () => {
    await expect(defi.connect(user).Owner()).to.be.revertedWith("OnlyOwner");
  });

  it("stake", async () => {
    await defi.connect(user).mintToken("Bayern", "FCB", 1000);
    const t = await defi.connect(user).OwnerToken(user.address);
    const tAddress = t[0];
    const tokenContract = new ethers.Contract(tAddress, ABI.abi, user);
    const tx = await tokenContract
      .connect(user)
      .increaseAllowance(defi.address, 100);
    await tx.wait();

    await defi.connect(user).stake(tAddress, 90);
    expect(await defi.connect(user).getTokenBalance(tAddress)).to.equal(910);
    expect(await tokenContract.balanceOf(defi.address)).to.equal(90);
  });

  it("unstake", async () => {
    await defi.connect(user).mintToken("Bayern", "FCB", 1000);
    const t = await defi.connect(user).OwnerToken(user.address);
    const tAddress = t[0];
    const tokenContract = new ethers.Contract(tAddress, ABI.abi, user);
    const tx = await tokenContract
      .connect(user)
      .increaseAllowance(defi.address, 100);
    await tx.wait();

    await defi.connect(user).stake(tAddress, 90);
    await defi.connect(user).unstake(tAddress, 80);
    expect(await tokenContract.balanceOf(defi.address)).to.equal(10);
    expect(await defi.connect(user).getTokenBalance(tAddress)).to.equal(990);
  });

  it("TokenMinted", async () => {
    await defi.connect(user).mintToken("Bayern", "FCB", 1000);
    const t = await defi.connect(user).OwnerToken(user.address);
    defi.on("TokenMinted", (tAddress, name, symbol, owner) => {
      expect(tAddress).to.equal(t[0]);
      expect(name).to.equal("Bayern");
      expect(symbol).to.equal("FCB");
      expect(owner.toString()).to.equal(user.address);
    });
  });
});

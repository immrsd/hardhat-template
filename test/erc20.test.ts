import { ethers } from "hardhat";
import chai from "chai";
import { solidity } from "ethereum-waffle";
import { TestToken__factory } from "../typechain";

chai.use(solidity);
const { expect } = chai;

describe("Token", () => {
  let contractAddress: string;

  beforeEach(async () => {
    const [owner] = await ethers.getSigners();
    const factory = new TestToken__factory(owner);
    const ownerInstance = await factory.deploy();
    contractAddress = ownerInstance.address;

    expect(await ownerInstance.totalSupply()).to.eq(0);
  });
  describe("Mint", async () => {
    it("Should mint some tokens", async () => {
      const [owner, user] = await ethers.getSigners();
      const ownerInstance = new TestToken__factory(owner).attach(contractAddress);
      const toMint = ethers.utils.parseEther("1");

      await ownerInstance.mint(user.address, toMint);
      expect(await ownerInstance.totalSupply()).to.eq(toMint);
    });
  });

  describe("Transfer", async () => {
    it("Should transfer tokens between users", async () => {
      const [owner, sender, receiver] = await ethers.getSigners();
      const ownerInstance = new TestToken__factory(owner).attach(contractAddress);
      const toMint = ethers.utils.parseEther("1");

      await ownerInstance.mint(sender.address, toMint);
      expect(await ownerInstance.balanceOf(sender.address)).to.eq(toMint);

      const senderInstance = new TestToken__factory(sender).attach(contractAddress);
      const toSend = ethers.utils.parseEther("0.4");
      await senderInstance.transfer(receiver.address, toSend);

      expect(await senderInstance.balanceOf(receiver.address)).to.eq(toSend);
    });

    it("Should fail to transfer with low balance", async () => {
      const [owner, sender, receiver] = await ethers.getSigners();
      const ownerrInstance = new TestToken__factory(owner).attach(contractAddress);
      const toMint = ethers.utils.parseEther("1");

      await ownerrInstance.mint(sender.address, toMint);
      expect(await ownerrInstance.balanceOf(sender.address)).to.eq(toMint);

      const senderInstance = new TestToken__factory(sender).attach(contractAddress);
      const toSend = ethers.utils.parseEther("1.1");

      // Notice await is on the expect
      await expect(senderInstance.transfer(receiver.address, toSend)).to.be.revertedWith(
        "transfer amount exceeds balance",
      );
    });
  });
});

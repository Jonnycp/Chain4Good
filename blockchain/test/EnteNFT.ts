import { expect } from "chai";
import { network } from "hardhat";
const { ethers } = await network.connect();

describe("EnteNFT (Soulbound Token)", function () {
  async function deployFixture() {
    const [owner, ente, amico] = await ethers.getSigners();
    const enteNFT = await ethers.deployContract("EnteNFT");
    return { enteNFT, owner, ente, amico };
  }

  it("Permettere solo all'owner di mintare l'NFT", async function () {
    const { enteNFT, ente, amico } = await deployFixture();

    await expect(enteNFT.safeMint(ente.address)).to.be.fulfilled;
    await expect(
      enteNFT.connect(amico).safeMint(amico.address)
    ).to.be.revertedWithCustomError(enteNFT, "OwnableUnauthorizedAccount")
      .withArgs(amico.address);
  });

  it("Impedire il trasferimento dell'NFT (Soulbound)", async function () {
    const { enteNFT, ente, amico } = await deployFixture();

    await enteNFT.safeMint(ente.address);
    expect(await enteNFT.balanceOf(ente.address)).to.equal(1n);

    await expect(
      enteNFT.connect(ente).transferFrom(ente.address, amico.address, 0n)
    ).to.be.revertedWith("Questo NFT e' Soulbound e non puo' essere trasferito");
  });
});
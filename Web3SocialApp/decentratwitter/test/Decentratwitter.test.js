const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Decentratwitter", function () {
    let decentratwitter;
    let deployer, user1, user2, users;
    let URI = "SampleURI";
    let postHash = "SampleHash";
    beforeEach(async () => {
        [deployer, user1, user2, ...users] = await ethers.getSigners();
        const DecentratwitterFactory = await ethers.getContractFactory("Decentratwitter");
        decentratwitter = await DecentratwitterFactory.deploy();
        await decentratwitter.connect(user1).mint(URI);
    })
    describe('Deployment', async() => {
        it("Should track name and symbol", async function () {
            const nftName = "Decentratwitter"
            const nftSymbol = "DAPP"
            expect(await decentratwitter.name()).to.equal(nftName);
            expect(await decentratwitter.symbol()).to.equal(nftSymbol);
        });
    })
    describe('Minting NFTs', async () => {
        it("Should track exah minted NFT", async function () {
            expect(await decentratwitter.tokenCount()).to.equal(1);
            expect(await decentratwitter.balanceOf(user1.address)).to.equal(1);
            expect(await decentratwitter.tokenURI(1)).to.equal(URI);
            await decentratwitter.connect(user2).mint(URI);
            expect(await decentratwitter.tokenCount()).to.equal(2);
            expect(await decentratwitter.balanceOf(user2.address)).to.equal(1);
            expect(await decentratwitter.tokenURI(2)).to.equal(URI);
        });
    })
});
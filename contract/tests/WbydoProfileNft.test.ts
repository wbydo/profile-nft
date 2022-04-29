import { expect } from 'chai';
import { waffle, ethers } from 'hardhat';

import { BigNumber } from 'ethers';

const { loadFixture } = waffle;

const baseURI = 'https://example.com/metadata/';

describe('WbydoProfileNft', () => {
  const fixture = async () => {
    const [owner, other] = await ethers.getSigners();

    const nft = await ethers
      .getContractFactory('WbydoProfileNft')
      .then((factory) => {
        return factory.deploy(baseURI);
      })
      .then((contracts) => {
        return contracts.deployed();
      });

    return { owner, nft, other };
  };

  it('deploy', async () => {
    await loadFixture(fixture);
  });

  describe('TokenURI', async () => {
    it('tokenURIが期待通りであること', async () => {
      const { nft, owner } = await loadFixture(fixture);
      const connectedNft = nft.connect(owner);
      await connectedNft.mint(0);
      expect(await connectedNft.tokenURI(0)).to.be.equal(
        'https://example.com/metadata/0.json'
      );
    });
  });

  describe('mint', async () => {
    it('owner以外が実行するとrevertすること', async () => {
      const { nft, other } = await loadFixture(fixture);
      await expect(nft.connect(other).mint(999)).to.be.revertedWith(
        'Ownable: caller is not the owner'
      );
    });

    it('mint関数実行後にnftを所有していること', async () => {
      const { nft, owner } = await loadFixture(fixture);
      const connectedNft = nft.connect(owner);
      await connectedNft.mint(555);
      expect(await connectedNft.ownerOf(555)).to.be.equal(owner.address);

      await connectedNft.mint(666);
      expect(await connectedNft.ownerOf(666)).to.be.equal(owner.address);

      expect(await connectedNft.balanceOf(owner.address)).to.be.equal(2);
    });
  });
});

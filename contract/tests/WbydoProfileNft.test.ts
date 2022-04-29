import { expect } from 'chai';
import { ethers } from 'hardhat';

import { BigNumber } from 'ethers';

import { loadFixture } from 'ethereum-waffle';

// MEMO:
// const signers = await ethers.getSigners();

const fixture = async () => {
  const [owner, other] = await ethers.getSigners();

  const nft = await ethers
    .getContractFactory('WbydoProfileNft')
    .then((factory) => {
      return factory.deploy();
    })
    .then((contracts) => {
      return contracts.deployed();
    });

  return { owner, nft, other };
};

describe('WbydoProfileNft', () => {
  it('deploy', async () => {
    await loadFixture(fixture);
  });

  describe('setTokenURI', async () => {
    it('owner以外が実行するとrevertすること', async () => {
      const { nft, other } = await loadFixture(fixture);
      await expect(
        nft.connect(other).setTokenURI(0, 'asdf')
      ).to.be.revertedWith('Ownable: caller is not the owner');
    });

    // TODO:
    // it('', async () => {
    //   const { nft, owner } = await loadFixture(fixture);
    //   const connectedNft = nft.connect(owner);
    //   connectedNft.setTokenURI(0, 'asdf');
    //   expect(await connectedNft.tokenURI(0)).to.be('hoge');
    // });
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

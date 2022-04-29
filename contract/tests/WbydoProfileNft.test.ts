import { expect } from 'chai';
import { ethers } from 'hardhat';

import { BigNumber } from 'ethers';

import { loadFixture } from 'ethereum-waffle';

// MEMO:
// const signers = await ethers.getSigners();

const fixture = async () => {
  const nft = await ethers
    .getContractFactory('WbydoProfileNft')
    .then((factory) => {
      return factory.deploy();
    })
    .then((contracts) => {
      return contracts.deployed();
    });

  return { nft };
};

describe('WbydoProfileNft', () => {
  it('deploy', async () => {
    const { nft } = await loadFixture(fixture);
  });
});

import { expect } from 'chai';
import { ethers } from 'hardhat';

import { BigNumber } from 'ethers';

import { loadFixture } from 'ethereum-waffle';

// MEMO:
// const signers = await ethers.getSigners();

const fixture = async () => {
  const testToken = await ethers
    .getContractFactory('TestToken')
    .then((factory) => {
      return factory.deploy(
        BigNumber.from(100).mul(BigNumber.from(10).pow(18))
      );
    })
    .then((contracts) => {
      return contracts.deployed();
    });

  return { testToken };
};

describe('TestToken', () => {
  it('deploy', async () => {
    const { testToken } = await loadFixture(fixture);
  });

  it('総供給が等しい', async function () {
    const { testToken } = await loadFixture(fixture);

    const expected = BigNumber.from(100).mul(BigNumber.from(10).pow(18));
    expect(await testToken.totalSupply()).to.equal(expected);
  });
});

import { ethers } from 'hardhat';
import { BigNumber } from 'ethers';

const main = async () => {
  const contract = await ethers
    .getContractFactory('TestToken')
    .then((factory) => {
      return factory.deploy(
        BigNumber.from('100').mul(BigNumber.from('10').pow(18))
      );
    });
  await contract.deployed();

  console.log('TestToken deployed to:', contract.address);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

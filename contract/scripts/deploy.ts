import { BigNumber } from 'ethers';
import { ethers, network } from 'hardhat';

const chainName = network.name;
if (chainName !== 'mumbai' && chainName !== 'polygon') {
  throw new Error(`chainName: ${chainName}`);
}

const BASE_URI_STG = process.env.BASE_URI_STG;
if (BASE_URI_STG == null || BASE_URI_STG === '') {
  throw new Error('BASE_URI_STG is empty.');
}

const BASE_URI_PROD = process.env.BASE_URI_PROD;
if (BASE_URI_PROD == null || BASE_URI_PROD === '') {
  throw new Error('BASE_URI_STG is empty.');
}

const gasPrice =
  process.env.GAS_PRICE != null && process.env.GAS_PRICE !== ''
    ? process.env.GAS_PRICE
    : '50';

const baseURI = (() => {
  if (chainName === 'mumbai') {
    return BASE_URI_STG;
  } else {
    return BASE_URI_PROD;
  }
})();

const main = async () => {
  const contract = await ethers
    .getContractFactory('WbydoProfileNft')
    .then((factory) => {
      return factory.deploy(baseURI, {
        gasPrice: ethers.utils.parseUnits(gasPrice, 'gwei'),
        type: 0,
        gasLimit: BigNumber.from('1900000'),
      });
    })
    .then((contract) => {
      return contract.deployed();
    });
  const { address, deployTransaction } = contract;
  const { hash } = deployTransaction;
  console.log({ address, hash });
};

main().catch((error: unknown) => {
  console.error(`${error}`);
  process.exit(1);
});

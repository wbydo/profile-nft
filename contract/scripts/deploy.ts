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
      return factory.deploy(baseURI);
    })
    .then((contract) => {
      return contract.deployed();
    });
  const { address, deployTransaction } = contract;
  console.log({ address, deployTransaction });

  const receipt0 = await contract.mint(0).catch((err: unknown) => {
    throw new Error(`${err}`);
  });
  console.log({ receipt0 });

  const receipt1 = await contract.mint(1).catch((err: unknown) => {
    throw new Error(`${err}`);
  });
  console.log({ receipt1 });
};

main().catch((error: unknown) => {
  console.error(`${error}`);
  process.exit(1);
});

import { ethers, network } from 'hardhat';
import { BigNumber } from 'ethers';

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

const NFT_ADDRESS = process.env.NFT_ADDRESS;
if (NFT_ADDRESS == null || NFT_ADDRESS === '') {
  throw new Error('NFT_ADDRESS is empty.');
}

const MINT_ID = process.env.MINT_ID;
if (MINT_ID == null || MINT_ID === '') {
  throw new Error('MINT_ID is empty.');
}

const gasPrice =
  process.env.GAS_PRICE != null && process.env.GAS_PRICE !== ''
    ? process.env.GAS_PRICE
    : '50';

const main = async () => {
  const nft = (await ethers.getContractFactory('WbydoProfileNft')).attach(
    NFT_ADDRESS
  );

  const receipt = await nft
    .mint(MINT_ID, {
      gasPrice: ethers.utils.parseUnits(gasPrice, 'gwei'),
      type: 0,
      gasLimit: BigNumber.from('150000'),
    })
    .catch((err: unknown) => {
      throw new Error(`${err}`);
    });
  console.log({ receipt });
};

main().catch((error: unknown) => {
  console.error(`${error}`);
  process.exit(1);
});

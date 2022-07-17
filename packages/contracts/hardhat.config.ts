import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.13',
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000,
      },
    },
  },

  paths: {
    tests: './tests',
  },

  typechain: {
    outDir: './dist/contracts',
    target: 'ethers-v5',
    alwaysGenerateOverloads: false,
  },
};

export default config;

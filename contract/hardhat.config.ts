import { HardhatUserConfig } from 'hardhat/config';

import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-etherscan';

import '@typechain/hardhat';

import 'hardhat-watcher';

const MUMBAI_URL = process.env.MUMBAI_URL;
if (MUMBAI_URL == null || MUMBAI_URL === '') {
  throw new Error('MUMBAI_URL is empty');
}

const POLYGON_URL = process.env.POLYGON_URL;
if (POLYGON_URL == null || POLYGON_URL === '') {
  throw new Error('POLYGON_URL is empty');
}

const PRIVATE_KEY_STG = process.env.PRIVATE_KEY_STG;
if (PRIVATE_KEY_STG == null || PRIVATE_KEY_STG === '') {
  throw new Error('PRIVATE_KEY_STG is empty');
}

const PRIVATE_KEY_PROD = process.env.PRIVATE_KEY_PROD;
if (PRIVATE_KEY_PROD == null || PRIVATE_KEY_PROD === '') {
  throw new Error('PRIVATE_KEY_PROD is empty');
}

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
    sources: './contracts',
    tests: './tests',
    cache: './cache',
    artifacts: './artifacts',
  },

  networks: {
    hardhat: {},
    mumbai: {
      url: MUMBAI_URL,
      accounts: [PRIVATE_KEY_STG],
    },
    polygon: {
      url: POLYGON_URL,
      accounts: [PRIVATE_KEY_PROD],
    },
  },

  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },

  typechain: {
    outDir: './types/contracts',
    target: 'ethers-v5',
    alwaysGenerateOverloads: false,
  },

  watcher: {
    myWatchTask: {
      tasks: ['clean', 'compile', 'test'],
      files: ['./contracts/**/*.', './tests/**/*'],
      verbose: true,
    },
  },
};

export default config;

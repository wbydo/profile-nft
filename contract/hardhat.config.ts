import * as dotenv from 'dotenv';

import { HardhatUserConfig } from 'hardhat/config';

import '@nomiclabs/hardhat-waffle';
import '@nomiclabs/hardhat-etherscan';

import '@typechain/hardhat';

import 'hardhat-watcher';

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.9',
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
    sampleChain: {
      url: '',
      chainId: 999999999999,
      accounts: [
        'aaaabbbbccccddddaaaabbbbccccddddaaaabbbbccccddddaaaabbbbccccdddd',
      ],
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

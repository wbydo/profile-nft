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

  networks: {
    hardhat: {
      accounts:
        process.env.PRIVATE_KEY_STG != null
          ? [
              {
                privateKey: process.env.PRIVATE_KEY_STG,
                balance: '500000000000000000000',
              },
            ]
          : {},
    },
  },

  typechain: {
    outDir: './dist/contracts',
    target: 'ethers-v5',
    alwaysGenerateOverloads: false,
  },
};

export default config;

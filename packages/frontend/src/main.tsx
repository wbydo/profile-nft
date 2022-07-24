import * as React from 'react';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  WagmiConfig,
  createClient,
  useNetwork,
  useAccount,
  chain,
  useConnect,
} from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { getDefaultProvider } from 'ethers';

import { Deploy, Info, Mint, Faucet } from './components/organisms';
import { Top } from './components/pages/Top';

import './main.css';

const client = createClient({
  autoConnect: false,
  provider: getDefaultProvider(),
});

const chains = [
  // chain.mainnet,
  // chain.rinkeby,
  chain.goerli,
  // chain.polygon,
  chain.polygonMumbai,
  chain.hardhat,
];

const App = () => {
  const { connect, status: statusConnect } = useConnect({
    connector: new MetaMaskConnector({
      chains,
    }),
  });
  const { address, status: statusAccount } = useAccount();
  const { chain } = useNetwork();
  const [contractAddress, setContractAddress] = useState<string | null>(null);

  const status = { account: statusAccount, connect: statusConnect };

  return (
    <>
      <h1>Deploy Tool</h1>

      <Info
        {...{
          status,
          connect,
          chain,
          address,
        }}
      />

      <Deploy {...{ status, chain, contractAddress, setContractAddress }} />

      <Mint {...{ contractAddress }} />
      <hr />

      <footer>
        <Faucet />
      </footer>
    </>
  );
};

const container = document.getElementById('root');
const root = container != null ? createRoot(container) : null;

if (root != null) {
  root.render(
    <React.StrictMode>
      <WagmiConfig client={client}>
        <App />
      </WagmiConfig>
    </React.StrictMode>
  );
}

import * as React from 'react';
import { FC } from 'react';
import { createRoot } from 'react-dom/client';
import {
  WagmiConfig,
  createClient,
  useNetwork,
  useAccount,
  chain,
} from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { getDefaultProvider } from 'ethers';

import { useConnect } from 'wagmi';

import { Top } from './components/pages/Top';

import './main.css';

const client = createClient({
  autoConnect: false,
  provider: getDefaultProvider(),
});

const chains = [
  // chain.mainnet,
  chain.rinkeby,
  chain.goerli,
  // chain.polygon,
  chain.polygonMumbai,
];

const Connected = ({
  status,
  connect,
  chain,
}: {
  status: {
    connect: 'error' | 'success' | 'idle' | 'loading';
    account: 'connecting' | 'disconnected' | 'connected' | 'reconnecting';
  };
  connect: ReturnType<typeof useConnect>['connect'];
  chain: ReturnType<typeof useNetwork>['chain'];
}) => {
  if (status.connect === 'idle' || status.account === 'disconnected') {
    return <button {...{ onClick: () => connect() }}>connect</button>;
  }

  if (chain?.unsupported) {
    return <b>Wrong Network</b>;
  }

  return (
    <>
      connected: {{ error: '🚫', success: '✅', loading: '🔄' }[status.connect]}
    </>
  );
};

const App: FC = () => {
  const { connect, status: statusConnect } = useConnect({
    connector: new MetaMaskConnector({
      chains,
    }),
  });
  const { address, status: statusAccount } = useAccount();

  const { chain } = useNetwork();

  return (
    <>
      <h1>Deploy Tool</h1>

      <h2>Info</h2>
      <Connected
        {...{
          status: { account: statusAccount, connect: statusConnect },
          connect,
          chain,
        }}
      />

      <p>chain: {chain?.name}</p>
      <p>chainId: {chain?.id}</p>
      <p>supported: {chain == null ? '❓' : chain.unsupported ? '🚫' : '✅'}</p>

      <hr />
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

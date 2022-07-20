import * as React from 'react';
import { FC, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  WagmiConfig,
  createClient,
  useNetwork,
  useAccount,
  chain,
  useSigner,
} from 'wagmi';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { getDefaultProvider } from 'ethers';

import { WbydoProfileNft__factory } from '@wbydo/profile-nft-contracts/';

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
  chain.hardhat,
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

const Deploy = ({
  status,
  chain,
}: {
  status: {
    connect: 'error' | 'success' | 'idle' | 'loading';
    account: 'connecting' | 'disconnected' | 'connected' | 'reconnecting';
  };
  chain: ReturnType<typeof useNetwork>['chain'];
}) => {
  const { data: signer } = useSigner();
  const [baseUri, setBaseUri] = useState<string | null>(null);
  const [txHath, setTxHash] = useState<string | null>(null);
  const [contractAddress, setContractAddress] = useState<string | null>(null);

  if (signer == null) {
    return <></>;
  }

  if (
    status.connect !== 'success' ||
    status.account !== 'connected' ||
    chain?.unsupported !== false
  ) {
    return <>🔄</>;
  }

  if (txHath != null) {
    return (
      <>
        <p>txHash: {txHath}</p>
        <p>contractAddress: {contractAddress ?? '🔄'}</p>
      </>
    );
  }

  return (
    <>
      <input
        type="text"
        size={50}
        onChange={(e) => setBaseUri(e.target.value)}
      ></input>
      <button
        onClick={() => {
          (async () => {
            if (baseUri == null) {
              alert('baseUri is null');
              return;
            }
            const contract = await new WbydoProfileNft__factory(signer).deploy(
              baseUri
            );
            setTxHash(contract.deployTransaction.hash);
            await contract.deployed();
            setContractAddress(contract.address);
          })().catch((e) => console.error(e));
        }}
      >
        deploy
      </button>
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
  const status = { account: statusAccount, connect: statusConnect };

  return (
    <>
      <h1>Deploy Tool</h1>

      <h2>Info</h2>
      <Connected
        {...{
          status,
          connect,
          chain,
        }}
      />

      <p>chain: {chain?.name}</p>
      <p>chainId: {chain?.id}</p>

      <h2>Deploy</h2>
      <Deploy
        {...{
          status,
          chain,
        }}
      />
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

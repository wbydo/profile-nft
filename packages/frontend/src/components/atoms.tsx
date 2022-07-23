import * as React from 'react';
import { ReactNode } from 'react';
import { useNetwork, useConnect, useSigner } from 'wagmi';

import { Status } from '../types';

export const Section = ({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) => {
  return (
    <section>
      <h2>{title}</h2>
      {children}
    </section>
  );
};

export const Connected = ({
  status,
  connect,
  chain,
}: {
  status: Status;
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

export const DeployButton = ({
  status,
  chain,
  signer,
  txHath,
  contractAddress,
  setBaseUri,
  deployHandler,
}: {
  status: Status;
  chain: ReturnType<typeof useNetwork>['chain'];
  signer: ReturnType<typeof useSigner>['data'];
  txHath: string | null;
  contractAddress: string | null;
  setBaseUri: (arg: string | null) => void;
  deployHandler: () => void;
}) => {
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
      <button onClick={deployHandler}>deploy</button>
    </>
  );
};

import * as React from 'react';
import { FC } from 'react';
import { createRoot } from 'react-dom/client';

import { providers } from 'ethers';
import { Web3ReactProvider } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42],
});

import { Top } from './components/pages/Top';

import './main.css';

const getLibrary = (provider: providers.ExternalProvider) => {
  return new providers.Web3Provider(provider);
};

const App: FC = () => (
  <Web3ReactProvider {...{ getLibrary, children: <Top /> }} />
);

const container = document.getElementById('root');
const root = container != null ? createRoot(container) : null;

if (root != null) {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

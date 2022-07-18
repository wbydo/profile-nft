import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';

import { providers } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import detectEthereumProvider from '@metamask/detect-provider';

import { styles } from './Top.css';

export const injected = new InjectedConnector({
  supportedChainIds: [4, 5, 80001],
});

interface ConnectInfo {
  chainId: string;
}

type Handlers = {
  // https://docs.metamask.io/guide/ethereum-provider.html#connect
  connect: (connectInfo: ConnectInfo) => void;

  // https://docs.metamask.io/guide/ethereum-provider.html#disconnect
  disconnect: (error: Error) => void;

  // https://docs.metamask.io/guide/ethereum-provider.html#accountschanged
  accountsChanged: (accounts: string[]) => void;

  // https://docs.metamask.io/guide/ethereum-provider.html#chainchanged
  chainChanged: (chainId: string) => void;

  // https://docs.metamask.io/guide/ethereum-provider.html#networkchanged-deprecated
  // WARNING: DEPRECATED
  networkChanged: (networkId: string) => void;
};

interface EtherumEventEmitter {
  on?: <EN extends keyof Handlers>(
    eventName: EN,
    handler: Handlers[EN]
  ) => void;
  removeListener: <EN extends keyof Handlers>(
    eventName: EN,
    handler: Handlers[EN]
  ) => void;
}

type Ethereum = providers.ExternalProvider &
  EtherumEventEmitter & {
    isConnected: () => boolean;
    // on: (eventName: 'connect' | 'disconnect', handler: () => void) => void;
  };

export function useEagerConnect() {
  const { activate, active } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    (async () => {
      const isAuthorized = await injected.isAuthorized();
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        setTried(true);
      }
    })().catch((e) => {
      throw e;
    });
  }, [activate]); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}

export function useInactiveListener(suppress = false) {
  const { active, error, activate } = useWeb3React();

  const [ethereum, setEthereum] = useState<Ethereum | null>(null);
  useEffect(() => {
    (async () => {
      setEthereum(
        // WARNING: asでキャストしないと仕方がないので実施。必要あればケアする。
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        (await detectEthereumProvider({ mustBeMetaMask: true })) as Ethereum
      );
      console.log('setEthereum');
    })().catch((err) => {
      throw err;
    });
  }, []);

  useEffect(() => {
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleConnect = () => {
        console.log("Handling 'connect' event");
        void activate(injected);
      };
      const handleChainChanged = (chainId: string | number) => {
        console.log("Handling 'chainChanged' event with payload", chainId);
        void activate(injected);
      };
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("Handling 'accountsChanged' event with payload", accounts);
        if (accounts.length > 0) {
          void activate(injected);
        }
      };
      const handleNetworkChanged = (networkId: string | number) => {
        console.log("Handling 'networkChanged' event with payload", networkId);
        void activate(injected);
      };

      ethereum.on('connect', handleConnect);
      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);
      ethereum.on('networkChanged', handleNetworkChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('connect', handleConnect);
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
          ethereum.removeListener('networkChanged', handleNetworkChanged);
        }
      };
    }
  }, [active, error, suppress, activate, ethereum]);
}

export const Top = () => {
  const [desiredChainid, setDesiredChainId] = useState<number | null>(null);

  const context = useWeb3React<providers.Web3Provider>();
  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error,
  } = context;

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] =
    useState<typeof connector>();

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined);
    }
  }, [activatingConnector, connector]);

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect();

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);

  // debug
  useEffect(() => {
    console.log({
      connector,
      library,
      chainId,
      account,
      activate,
      deactivate,
      active,
      error,
    });
  }, [
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error,
  ]);

  const connectHandler = useCallback(() => {
    console.log({ activate });
    activate(injected).catch((e) => {
      throw e;
    });
  }, [activate]);

  return (
    <>
      <select onChange={(e) => setDesiredChainId(parseInt(e.target.value))}>
        {/* <option value="">chainA</option> */}
        <option value="4">Ethreum Rinkeby</option>
        <option value="5">Görli</option>
        {/* <option>chainD</option> */}
        <option value="80001">Polygon Mumbai</option>
      </select>
      {<button onClick={connectHandler}>connect</button>}
      <p>
        <b>status:</b> {JSON.stringify(active)}
      </p>
      <p>
        <b>address:</b> {JSON.stringify(account)}
      </p>
      <p>
        <b>chainId:</b> {JSON.stringify(chainId)}
      </p>
      <button>deploy</button>
      <hr />
      <p>desiredChainid: {desiredChainid}</p>
    </>
  );
};

import * as React from 'react';
import { useState, useCallback } from 'react';
import { useNetwork, useSigner } from 'wagmi';

import { WbydoProfileNft__factory } from '@wbydo/profile-nft-contracts/';

import {
  DeployButton as DeployButtonComponent,
  MintButton as MintButtonComponent,
} from './components/atoms';
import { Status } from './types';

const useDeployButton = (setContractAddress: (arg: string | null) => void) => {
  const { data: signer } = useSigner();
  const [baseUri, setBaseUri] = useState<string | null>(null);
  const [txHath, setTxHash] = useState<string | null>(null);

  const deployHandler = useCallback(() => {
    (async () => {
      if (baseUri == null) {
        alert('baseUri is null');
        return;
      }

      if (signer == null) {
        alert('signer is null');
        return;
      }

      const contract = await new WbydoProfileNft__factory(signer).deploy(
        baseUri
      );
      setTxHash(contract.deployTransaction.hash);
      await contract.deployed();
      setContractAddress(contract.address);
    })().catch((e) => console.error(e));
  }, [signer, baseUri, setContractAddress]);

  return { signer, txHath, setBaseUri, deployHandler };
};

export const DeployButton = ({
  status,
  chain,
  contractAddress,
  setContractAddress,
}: {
  status: Status;
  chain: ReturnType<typeof useNetwork>['chain'];
  contractAddress: string | null;
  setContractAddress: (arg: string | null) => void;
}) => {
  const { signer, txHath, setBaseUri, deployHandler } =
    useDeployButton(setContractAddress);
  return (
    <DeployButtonComponent
      {...{
        status,
        chain,
        signer,
        txHath,
        contractAddress,
        setBaseUri,
        deployHandler,
      }}
    />
  );
};

export const MintButton = ({
  contractAddress,
  tokenId,
}: {
  contractAddress: string | null;
  tokenId: number;
}) => {
  const { data: signer } = useSigner();
  const [txHash, setTxHash] = useState<string | null>();

  const mintHandler = React.useCallback(() => {
    if (signer == null) return;
    if (contractAddress == null) return;
    const contract = new WbydoProfileNft__factory(signer).attach(
      contractAddress
    );
    (async () => {
      const receipt = await contract.mint(tokenId);
      setTxHash(receipt.blockHash);
    })().catch((e) => console.error(e));
  }, [contractAddress, signer, tokenId]);

  return <MintButtonComponent {...{ contractAddress, tokenId, mintHandler }} />;
};

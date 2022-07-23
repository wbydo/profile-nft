import * as React from 'react';
import { useNetwork, useConnect } from 'wagmi';

import { Section, Connected } from './atoms';
import { DeployButton } from '../containers';
import { Status } from '../types';

export const Info = ({
  status,
  connect,
  chain,
  address,
}: {
  status: Status;
  connect: ReturnType<typeof useConnect>['connect'];
  chain: ReturnType<typeof useNetwork>['chain'];
  address?: string;
}) => {
  return (
    <Section {...{ title: 'Info' }}>
      <Connected
        {...{
          status,
          connect,
          chain,
        }}
      />

      <p>chain: {chain?.name}</p>
      <p>chainId: {chain?.id}</p>
      <p>address: {address}</p>
    </Section>
  );
};

export const Deploy = ({
  status,
  chain,
}: {
  status: Status;
  chain: ReturnType<typeof useNetwork>['chain'];
}) => {
  return (
    <Section {...{ title: 'Deploy' }}>
      <DeployButton
        {...{
          status,
          chain,
        }}
      />
    </Section>
  );
};

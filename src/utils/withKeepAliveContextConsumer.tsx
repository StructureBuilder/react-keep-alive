import React from 'react';
import {IKeepAliveProviderImpl, IKeepAliveProviderProps} from '../components/Provider';
import KeepAliveContext from '../contexts/KeepAliveContext';
import getDisplayName from './getDisplayName';

type IKeepAliveContextProps = IKeepAliveProviderImpl & IKeepAliveProviderProps;

export interface IKeepAliveContextConsumerComponentProps {
  _keepAliveContextProps: IKeepAliveContextProps;
}

export const WithKeepAliveContextConsumerDisplayName = 'withKeepAliveContextConsumer';

export default function withKeepAliveContextConsumer<P = any>(Component: React.ComponentType<IKeepAliveContextConsumerComponentProps & P>) {
  const WithKeepAliveContextConsumer = (props: P) => (
    <KeepAliveContext.Consumer>
      {(contextProps: IKeepAliveContextProps) => <Component _keepAliveContextProps={contextProps} {...props} />}
    </KeepAliveContext.Consumer>
  );

  WithKeepAliveContextConsumer.displayName = `${WithKeepAliveContextConsumerDisplayName}(${getDisplayName(Component)})`;
  return WithKeepAliveContextConsumer;
}

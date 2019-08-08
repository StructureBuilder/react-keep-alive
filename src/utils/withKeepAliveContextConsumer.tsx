import * as React from 'react';
import KeepAliveContext, {IKeepAliveContextProps} from '../contexts/KeepAliveContext';
import getDisplayName from './getDisplayName';

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

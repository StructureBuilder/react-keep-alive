import React from 'react';
import {IKeepAliveProviderImpl, IKeepAliveProviderProps} from '../components/Provider';
import KeepAliveContext from '../contexts/KeepAliveContext';
import getDisplayName from './getDisplayName';

type IKeepAliveContextProps = IKeepAliveProviderImpl & IKeepAliveProviderProps;

export interface IKeepAliveContextComponentProps {
  _keepAliveContextProps: IKeepAliveContextProps;
}

export default function withKeepAliveContextConsumer<P = any>(Component: React.ComponentType<IKeepAliveContextComponentProps & P>) {
  const NewComponent = (props: P) => (
    <KeepAliveContext.Consumer>
      {(contextProps: IKeepAliveContextProps) => <Component _keepAliveContextProps={contextProps} {...props} />}
    </KeepAliveContext.Consumer>
  );

  NewComponent.displayName = `withKeepAliveContextConsumer(${getDisplayName(Component)})`;
  return NewComponent;
}

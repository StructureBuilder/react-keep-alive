import React from 'react';
import IdentificationContext from '../contexts/IdentificationContext';
import getDisplayName from './getDisplayName';

export interface IIdentificationContextProps {
  identification: string;
  eventEmitter: any;
  keepAlive: boolean;
  activated: boolean;
  getLifecycle: () => number;
  isExisted: () => boolean;
}

export interface IIdentificationContextComponentProps {
  _identificationContextProps: IIdentificationContextProps;
}

export default function withIdentificationContextConsumer<P = any>(Component: React.ComponentType<IIdentificationContextComponentProps & P>) {
  const NewComponent = (props: P) => (
    <IdentificationContext.Consumer>
      {(contextProps: IIdentificationContextProps) => <Component _identificationContextProps={contextProps} {...props} />}
    </IdentificationContext.Consumer>
  );

  NewComponent.displayName = `withIdentificationContextConsumer(${getDisplayName(Component)})`;
  return NewComponent;
}

import React from 'react';
import IdentificationContext, {IIdentificationContextProps} from '../contexts/IdentificationContext';
import getDisplayName from './getDisplayName';

export interface IIdentificationContextConsumerComponentProps {
  _identificationContextProps: IIdentificationContextProps;
}

export const withIdentificationContextConsumerDisplayName = 'withIdentificationContextConsumer';

export default function withIdentificationContextConsumer<P = any>(Component: React.ComponentType<IIdentificationContextConsumerComponentProps & P>) {
  const WithIdentificationContextConsumer = (props: P) => (
    <IdentificationContext.Consumer>
      {(contextProps: IIdentificationContextProps) => <Component _identificationContextProps={contextProps} {...props} />}
    </IdentificationContext.Consumer>
  );

  WithIdentificationContextConsumer.displayName = `${withIdentificationContextConsumerDisplayName}(${getDisplayName(Component)})`;
  return WithIdentificationContextConsumer;
}

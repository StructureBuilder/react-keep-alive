import React from 'react';
import IdentificationContext from '../contexts/IdentificationContext';
import getDisplayName from './getDisplayName';

export default function withIdentificationContextConsumer(Component) {
  const NewComponent = props => (
    <IdentificationContext.Consumer>
      {contextProps => <Component _identificationContextProps={contextProps || {}} {...props} />}
    </IdentificationContext.Consumer>
  );
  
  NewComponent.displayName = `withIdentificationContextConsumer(${getDisplayName(Component)})`;
  return NewComponent;
}
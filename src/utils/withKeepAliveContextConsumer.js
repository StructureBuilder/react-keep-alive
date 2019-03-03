import React from 'react';
import KeepAliveContext from '../contexts/KeepAliveContext';
import getDisplayName from './getDisplayName';

export default function withKeepAliveContextConsumer(Component) {
  const NewComponent = (props, ref) => (
    <KeepAliveContext.Consumer>
      {contextProps => <Component _keepAliveContextProps={contextProps || {}} {...props} ref={ref} />}
    </KeepAliveContext.Consumer>
  );
  
  NewComponent.displayName = `withKeepAliveContextConsumer(${getDisplayName(Component)})`;
  return  React.forwardRef(NewComponent);
}
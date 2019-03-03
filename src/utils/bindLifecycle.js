import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import noop from './noop';
import {COMMAND} from './keepAlive';
import withIdentificationContextConsumer from './withIdentificationContextConsumer';
import getDisplayName from './getDisplayName';

export default function bindLifecycle(Component) {
  const {
    componentDidMount = noop,
    componentDidUpdate = noop,
    componentDidActivate = noop,
    componentWillUnactivate = noop,
    componentWillUnmount = noop,
  } = Component.prototype;

  Component.prototype.componentDidMount = function () {
    componentDidMount.call(this);
    this._needActivate = false;
    const {
      _container: {
        identification,
        eventEmitter,
        activated,
      },
      keepAlive,
    } = this.props;
    // Determine whether to execute the componentDidActivate life cycle of the current component based on the activation state of the KeepAlive components
    if (!activated && keepAlive !== false) {
      componentDidActivate.call(this);
    }
    eventEmitter.on(
      [identification, COMMAND.ACTIVATE], 
      this._bindActivate = () => this._needActivate = true, 
      true,
    );
    eventEmitter.on(
      [identification, COMMAND.UNACTIVATE],
      this._bindUnactivate = () => {
        componentWillUnactivate.call(this);
        this._unmounted = false;
      },
      true,
    );
    eventEmitter.on(
      [identification, COMMAND.UNMOUNT],
      this._bindUnmount = () => {
        componentWillUnmount.call(this);
        this._unmounted = true;
      },
      true,
    );
  };
  Component.prototype.componentDidUpdate = function () {
    componentDidUpdate.call(this);
    if (this._needActivate) {
      this._needActivate = false;
      componentDidActivate.call(this);
    }
  };
  Component.prototype.componentWillUnmount = function () {
    if (!this._unmounted) {
      componentWillUnmount.call(this);
    }
    const {
      _container: {
        identification,
        eventEmitter,
      },
    } = this.props;
    eventEmitter.off(
      [identification, COMMAND.ACTIVATE],
      this._bindActivate,
    );
    eventEmitter.off(
      [identification, COMMAND.UNACTIVATE],
      this._bindUnactivate,
    );
    eventEmitter.off(
      [identification, COMMAND.UNMOUNT],
      this._bindUnmount,
    );
  };

  const NewComponent = withIdentificationContextConsumer(
    ({
      forwardRef, 
      _identificationContextProps: {
        identification, 
        eventEmitter, 
        activated, 
        keepAlive,
      },
      ...wrapperProps
    }) => (
      identification
        ? (
          <Component
            {...wrapperProps}
            keepAlive={keepAlive}
            ref={forwardRef || noop}
            _container={{
              identification,
              eventEmitter,
              activated,
            }}
          />
        ) 
        : null
    ),
  );
  
  NewComponent.displayName = `bindLifecycle(${getDisplayName(Component)})`;
  return hoistNonReactStatics(
    React.forwardRef((props, ref) => (
      <NewComponent {...props} forwardRef={ref} />
    )),
    Component,
  );
};

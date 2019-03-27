import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import noop from './noop';
import {warn} from './debug';
import {COMMAND} from './keepAliveDecorator';
import withIdentificationContextConsumer from './withIdentificationContextConsumer';
import getDisplayName from './getDisplayName';

export default function bindLifecycle<P = any>(Component: React.ComponentClass<P>) {
  const WrappedComponent = (Component as any).WrappedComponent || (Component as any).wrappedComponent || Component;

  const {
    componentDidMount = noop,
    componentDidUpdate = noop,
    componentWillUnmount = noop,
  } = WrappedComponent.prototype;

  WrappedComponent.prototype.componentDidMount = function () {
    componentDidMount.call(this);
    this._needActivate = false;
    const {
      _container: {
        identification,
        eventEmitter,
      },
    } = this.props;
    this._unmounted = false;
    eventEmitter.on(
      [identification, COMMAND.MOUNT],
      this._bindMount = () => this._needActivate = true,
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
  WrappedComponent.prototype.componentDidUpdate = function (...args: any) {
    if (this._needActivate) {
      this._needActivate = false;
      this._unmounted = false;
      componentDidMount.call(this);
    } else {
      componentDidUpdate.apply(this, args);
    }
  };
  WrappedComponent.prototype.componentWillUnmount = function () {
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
      [identification, COMMAND.MOUNT],
      this._bindMount,
    );
    eventEmitter.off(
      [identification, COMMAND.UNMOUNT],
      this._bindUnmount,
    );
  };

  const BindLifecycleHOC = withIdentificationContextConsumer(
    ({
      forwardRef,
      _identificationContextProps: {
        identification,
        eventEmitter,
      },
      ...wrapperProps
    }) => {
      if (!identification) {
        warn('[React Keep Alive] You should not use bindLifecycle outside a <KeepAlive>.');
        return null;
      }
      return (
        <Component
          {...wrapperProps}
          ref={forwardRef || noop}
          _container={{
            identification,
            eventEmitter,
          }}
        />
      );
    },
  );
  const BindLifecycle = React.forwardRef((props: P, ref) => (
    <BindLifecycleHOC {...props} forwardRef={ref} />
  ));

  (BindLifecycle as any).WrappedComponent = WrappedComponent;
  BindLifecycle.displayName = `bindLifecycle(${getDisplayName(Component)})`;
  return hoistNonReactStatics(
    BindLifecycle,
    Component,
  );
}

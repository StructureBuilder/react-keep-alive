import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import IdentificationContext from '../contexts/IdentificationContext';
import Consumer from '../components/Consumer';
import {START_MOUNTING_DOM, LIFECYCLE} from '../components/Provider';
import md5 from './md5';
import noop from './noop';
import getContextIdentificationByFiberNode from './getContextIdentificationByFiberNode';
import withIdentificationContextConsumer, {IIdentificationContextComponentProps} from './withIdentificationContextConsumer';
import withKeepAliveContextConsumer, {IKeepAliveContextComponentProps} from './withKeepAliveContextConsumer';
import changePositionByComment from './changePositionByComment';
import shallowEqual from './shallowEqual';
import getDisplayName from './getDisplayName';
import getKeepAlive from './getKeepAlive';

export enum COMMAND {
  UNACTIVATE = 'unactivate',
  UNMOUNT = 'unmount',
  ACTIVATE = 'activate',
}

export interface IOptions {
  name?: string;
  forwardRef?: boolean;
}

export const keepAliveDisplayName = 'keepAlive';

interface IKeepAliveDecorativeComponentProps {
  keepAlive?: boolean;
}

interface IListenUpperKeepAliveContainerProps extends IKeepAliveDecorativeComponentProps, IIdentificationContextComponentProps, IKeepAliveContextComponentProps {
  forwardedRef?: React.Ref<{}>;
}

interface IListenUpperKeepAliveContainerState {
  activated: boolean;
}

interface ITriggerLifecycleContainerProps extends IKeepAliveContextComponentProps {
  forwardedRef?: React.Ref<{}>;
  keepAlive: boolean;
  getCombinedKeepAlive: () => boolean;
}

interface IComponentProps {
  _container: object;
  keepAlive: boolean;
  ref: React.Ref<{}>;
}

export default function keepAliveDecorator({
  name,
  forwardRef = false,
}: IOptions = {}) {
  return (Component: React.ComponentType<IComponentProps>) => {
    const {
      WrappedComponent,
      wrappedComponent,
    } = Component;
    if (WrappedComponent || wrappedComponent) {
      Component = WrappedComponent || wrappedComponent;
    }
    
    const {
      componentDidMount = noop,
      componentDidUpdate = noop,
      componentDidActivate = noop,
      componentWillUnactivate = noop,
      componentWillUnmount = noop,
    } = Component.prototype;
    const displayName = (name || getDisplayName(Component)) as any;

    if (!displayName) {
      throw new Error('Each component must have a name, which can be the component\'s displayName or name static property. You can also configure name when keepAlive decorates the component.');
    }

    Component.prototype.componentDidMount = function () {
      const {
        _container,
        keepAlive,
      } = this.props;
      const {
        notNeedActivate,
        identification,
        eventEmitter,
      } = _container;
      notNeedActivate();
      const cb = () => {
        mount.call(this);
        eventEmitter.off([identification, START_MOUNTING_DOM], cb);
      };
      eventEmitter.on([identification, START_MOUNTING_DOM], cb);
      componentDidMount.call(this);
      if (keepAlive) {
        componentDidActivate.call(this);
      }
    };
    Component.prototype.componentDidUpdate = function () {
      componentDidUpdate.call(this);
      const {
        _container,
      } = this.props;
      const {
        notNeedActivate,
        isNeedActivate,
      } = _container;
      if (isNeedActivate()) {
        notNeedActivate();
        mount.call(this);
        this._unmounted = false;
        componentDidActivate.call(this);
      }
    };
    Component.prototype.componentWillUnactivate = function () {
      componentWillUnactivate.call(this);
      unmount.call(this);
    };
    Component.prototype.componentWillUnmount = function () {
      // Because we will manually call the componentWillUnmount lifecycle
      // so we need to prevent it from firing multiple times
      if (!this._unmounted) {
        this._unmounted = true;
        componentWillUnmount.call(this);
        unmount.call(this);
      }
    };

    function mount(this: any) {
      const {
        _container: {
          cache,
          identification,
          storeElement,
          setLifecycle,
        },
      } = this.props;
      const {renderElement} = cache[identification];
      setLifecycle(LIFECYCLE.UPDATING);
      changePositionByComment(identification, renderElement, storeElement);
    }

    function unmount(this: any) {
      const {
        _container: {
          identification,
          storeElement,
          cache,
          setLifecycle,
        },
      } = this.props;
      const {renderElement, ifStillActivate, reactivate} = cache[identification];
      setLifecycle(LIFECYCLE.UNMOUNTED);
      changePositionByComment(identification, storeElement, renderElement);
      if (ifStillActivate) {
        reactivate();
      }
    }

    class TriggerLifecycleContainer extends React.PureComponent<ITriggerLifecycleContainerProps> {
      private identification: string;

      private ref: any;

      private activated = false;

      private ifStillActivate = false;

      // Let the lifecycle of the cached component be called normally.
      private needActivate = true;

      private lifecycle = LIFECYCLE.MOUNTED;

      public componentDidMount() {
        if (!this.ifStillActivate) {
          this.activate();
        }
        const {
          keepAlive,
          _keepAliveContextProps: {
            eventEmitter,
          },
        } = this.props;
        if (keepAlive) {
          this.needActivate = true;
          eventEmitter.emit([this.identification, COMMAND.ACTIVATE]);
        }
      }

      public componentDidCatch() {
        if (!this.activated) {
          this.activate();
        }
      }

      public componentWillUnmount() {
        const {
          getCombinedKeepAlive,
          _keepAliveContextProps: {
            eventEmitter,
            isExisted,
          },
        } = this.props;
        const keepAlive = getCombinedKeepAlive();
        if (!keepAlive || !isExisted()) {
          if (this.ref) {
            this.ref.componentWillUnmount();
          }
          eventEmitter.emit([this.identification, COMMAND.UNMOUNT]);
        }
        // When the Provider components are unmounted, the cache is not needed,
        // so you don't have to execute the componentWillUnactivate lifecycle.
        if (keepAlive && isExisted()) {
          if (this.ref) {
            this.ref.componentWillUnactivate();
          }
          eventEmitter.emit([this.identification, COMMAND.UNACTIVATE]);
        }
      }

      private activate = () => {
        this.activated = true;
      }

      private reactivate = () => {
        this.ifStillActivate = false;
        this.forceUpdate();
      }

      private isNeedActivate = () => {
        return this.needActivate;
      }

      private notNeedActivate = () => {
        this.needActivate = false;
      }

      private getLifecycle = () => {
        return this.lifecycle;
      }

      private setLifecycle = (lifecycle: LIFECYCLE) => {
        this.lifecycle = lifecycle;
      }

      private setRef = (ref: any) => {
        this.ref = ref;
        const {
          forwardedRef,
        } = this.props;
        if (forwardedRef) {
          (forwardedRef as any)(ref);
        }
      }

      public render() {
        if (!this.identification) {
          // We need to generate a corresponding unique identifier based on the information of the component.
          const {
            providerIdentification,
            cache,
          } = this.props._keepAliveContextProps;
          const {
            paths,
            globalKey,
            typeNames,
          } = getContextIdentificationByFiberNode((this as any)._reactInternalFiber);
          this.identification = md5(
            `${providerIdentification}${displayName}${globalKey ? `${globalKey}${typeNames}` : paths}`,
          );
          // The last activated component must be unactivated before it can be activated again.
          const currentCache = cache[this.identification];
          if (currentCache) {
            this.ifStillActivate = currentCache.activated as boolean;
            currentCache.ifStillActivate = this.ifStillActivate;
            currentCache.reactivate = this.reactivate;
          }
        }
        const {
          isNeedActivate,
          notNeedActivate,
          activated,
          getLifecycle,
          setLifecycle,
          setRef,
          identification,
          ifStillActivate,
        } = this;
        const {
          keepAlive,
          forwardedRef,
          getCombinedKeepAlive,
          _keepAliveContextProps: {
            isExisted,
            storeElement,
            cache,
            eventEmitter,
            setCache,
            unactivate,
          },
          ...wrapperProps
        } = this.props;
        return !ifStillActivate
          ? (
            <Consumer
              identification={identification}
              keepAlive={keepAlive}
              cache={cache}
              setCache={setCache}
              unactivate={unactivate}
            >
              <IdentificationContext.Provider
                value={{
                  identification,
                  eventEmitter,
                  keepAlive,
                  activated,
                  getLifecycle,
                  isExisted,
                }}
              >
                <Component
                  {...wrapperProps}
                  keepAlive={keepAlive}
                  ref={setRef}
                  _container={{
                    isNeedActivate,
                    notNeedActivate,
                    setLifecycle,
                    eventEmitter,
                    identification,
                    storeElement,
                    cache,
                  }}
                />
              </IdentificationContext.Provider>
            </Consumer>
          )
        : null;
      }
    }

    class ListenUpperKeepAliveContainer extends React.Component<IListenUpperKeepAliveContainerProps, IListenUpperKeepAliveContainerState> {
      private combinedKeepAlive: boolean;

      public state = {
        activated: true,
      };

      private activate: () => void;

      private unactivate: () => void;

      private unmount: () => void;

      public shouldComponentUpdate(nextProps: IListenUpperKeepAliveContainerProps, nextState: IListenUpperKeepAliveContainerState) {
        if (this.state.activated !== nextState.activated) {
          return true;
        }
        const {
          _keepAliveContextProps,
          _identificationContextProps,
          ...rest
        } = this.props;
        const {
          _keepAliveContextProps: nextKeepAliveContextProps,
          _identificationContextProps: nextIdentificationContextProps,
          ...nextRest
        } = nextProps;
        if (!shallowEqual(rest, nextRest)) {
          return true;
        }
        if (
          !shallowEqual(_keepAliveContextProps, nextKeepAliveContextProps) ||
          !shallowEqual(_identificationContextProps, nextIdentificationContextProps)
        ) {
          return true;
        }
        return false;
      }

      public componentDidMount() {
        this.listenUpperKeepAlive();
      }

      public componentWillUnmount() {
        this.unlistenUpperKeepAlive();
      }

      private listenUpperKeepAlive() {
        const {identification, eventEmitter} = this.props._identificationContextProps;
        if (!identification) {
          return;
        }
        eventEmitter.on(
          [identification, COMMAND.ACTIVATE],
          this.activate = () => this.setState({activated: true}),
          true,
        );
        eventEmitter.on(
          [identification, COMMAND.UNACTIVATE],
          this.unactivate = () => this.setState({activated: false}),
          true,
        );
        eventEmitter.on(
          [identification, COMMAND.UNMOUNT],
          this.unmount = () => this.setState({activated: false}),
          true,
        );
      }

      private unlistenUpperKeepAlive() {
        const {identification, eventEmitter} = this.props._identificationContextProps;
        if (!identification) {
          return;
        }
        eventEmitter.off([identification, COMMAND.ACTIVATE], this.activate);
        eventEmitter.off([identification, COMMAND.UNACTIVATE], this.unactivate);
        eventEmitter.off([identification, COMMAND.UNMOUNT], this.unmount);
      }

      private getCombinedKeepAlive = () => {
        return this.combinedKeepAlive;
      }

      public render() {
        const {
          _identificationContextProps: {
            identification,
            keepAlive: upperKeepAlive,
            getLifecycle,
          },
          keepAlive,
          ...wrapperProps
        } = this.props;
        const {activated} = this.state;
        const {
          _keepAliveContextProps: {
            include,
            exclude,
          },
        } = wrapperProps;
        // When the parent KeepAlive component is mounted or unmounted,
        // use the keepAlive prop of the parent KeepAlive component.
        const newKeepAlive = getKeepAlive(displayName, include, exclude, keepAlive);
        this.combinedKeepAlive = getLifecycle === undefined || getLifecycle() === LIFECYCLE.UPDATING
          ? newKeepAlive
          : identification
            ? upperKeepAlive && newKeepAlive
            : newKeepAlive;
        return activated
          ? (
            <TriggerLifecycleContainer
              {...wrapperProps}
              keepAlive={this.combinedKeepAlive}
              getCombinedKeepAlive={this.getCombinedKeepAlive}
            />
          )
          : null;
      }
    }

    const ListenUpperKeepAliveContainerHOC: any = withKeepAliveContextConsumer(
      withIdentificationContextConsumer(ListenUpperKeepAliveContainer)
    );

    let KeepAlive: React.ComponentType<IKeepAliveDecorativeComponentProps> = ListenUpperKeepAliveContainerHOC;
    if (forwardRef) {
      KeepAlive = React.forwardRef((props, ref) => (
        <ListenUpperKeepAliveContainerHOC
          {...props}
          forwardedRef={ref}
        />
      ));
    }

    KeepAlive.WrappedComponent = Component;
    KeepAlive.displayName = `${keepAliveDisplayName}(${displayName})`;
    return hoistNonReactStatics(KeepAlive, Component);
  };
}

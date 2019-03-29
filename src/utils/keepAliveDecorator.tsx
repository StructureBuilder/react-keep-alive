import React from 'react';
import hoistNonReactStatics from 'hoist-non-react-statics';
import IdentificationContext from '../contexts/IdentificationContext';
import Consumer from '../components/Consumer';
import {LIFECYCLE} from '../components/Provider';
import md5 from './md5';
import {warn} from './debug';
import getKeyByFiberNode from './getKeyByFiberNode';
import withIdentificationContextConsumer, {IIdentificationContextConsumerComponentProps} from './withIdentificationContextConsumer';
import withKeepAliveContextConsumer, {IKeepAliveContextConsumerComponentProps} from './withKeepAliveContextConsumer';
import shallowEqual from './shallowEqual';
import getKeepAlive from './getKeepAlive';

export enum COMMAND {
  UNMOUNT = 'unmount',
  MOUNT = 'mount',
  CURRENT_UNMOUNT = 'current_unmount',
}

interface IListenUpperKeepAliveContainerProps extends IIdentificationContextConsumerComponentProps, IKeepAliveContextConsumerComponentProps {
  disabled?: boolean;
  name?: string;
}

interface IListenUpperKeepAliveContainerState {
  activated: boolean;
}

interface ITriggerLifecycleContainerProps extends IKeepAliveContextConsumerComponentProps {
  propKey: string;
  keepAlive: boolean;
}

/**
 * Decorating the <KeepAlive> component, the main function is to listen to events emitted by the upper <KeepAlive> component, triggering events of the current <KeepAlive> component.
 *
 * @export
 * @template P
 * @param {React.ComponentType<any>} Component
 * @returns {React.ComponentType<P>}
 */
export default function keepAliveDecorator<P = any>(Component: React.ComponentType<any>): React.ComponentType<P> {
  class TriggerLifecycleContainer extends React.PureComponent<ITriggerLifecycleContainerProps> {
    private identification: string;

    private ifStillActivate = false;

    // Let the lifecycle of the cached component be called normally.
    private needActivate = true;

    private lifecycle = LIFECYCLE.MOUNTED;

    constructor(props: ITriggerLifecycleContainerProps, ...args: any) {
      super(props, ...args);
      const {
        _keepAliveContextProps: {
          cache,
        },
      } = props;
      if (!cache) {
        warn('[React Keep Alive] You should not use <KeepAlive> outside a <Provider>.');
      }
    }

    public componentDidMount() {
      const {
        keepAlive,
        _keepAliveContextProps: {
          eventEmitter,
        },
      } = this.props;
      if (keepAlive) {
        this.needActivate = true;
        eventEmitter.emit([this.identification, COMMAND.MOUNT]);
      }
    }

    public componentWillUnmount() {
      const {
        _keepAliveContextProps: {
          eventEmitter,
        },
      } = this.props;
      eventEmitter.emit([this.identification, COMMAND.CURRENT_UNMOUNT]);
      eventEmitter.emit([this.identification, COMMAND.UNMOUNT]);
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

    public render() {
      const {
        propKey,
        keepAlive,
        _keepAliveContextProps: {
          isExisted,
          storeElement,
          cache,
          eventEmitter,
          setCache,
          unactivate,
          providerIdentification,
        },
        ...wrapperProps
      } = this.props;
      if (!this.identification) {
        // We need to generate a corresponding unique identifier based on the information of the component.
        this.identification = md5(
          `${providerIdentification}${propKey}`,
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
        getLifecycle,
        setLifecycle,
        identification,
        ifStillActivate,
      } = this;
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
                getLifecycle,
                isExisted,
              }}
            >
              <Component
                {...wrapperProps}
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
    public state = {
      activated: true,
    };

    private mount: () => void;

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
        [identification, COMMAND.MOUNT],
        this.mount = () => this.setState({activated: true}),
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
      eventEmitter.off([identification, COMMAND.MOUNT], this.mount);
      eventEmitter.off([identification, COMMAND.UNMOUNT], this.unmount);
    }

    public render() {
      const {
        _identificationContextProps: {
          identification,
          keepAlive: upperKeepAlive,
          getLifecycle,
        },
        disabled,
        name,
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
      const propKey = name || getKeyByFiberNode((this as any)._reactInternalFiber);
      if (!propKey) {
        warn('[React Keep Alive] <KeepAlive> components must have key or name.');
        return null;
      }
      const newKeepAlive = getKeepAlive(propKey, include, exclude, disabled);
      const combinedKeepAlive = getLifecycle === undefined || getLifecycle() === LIFECYCLE.UPDATING
        ? newKeepAlive
        : identification
          ? upperKeepAlive && newKeepAlive
          : newKeepAlive;
      return activated
        ? (
          <TriggerLifecycleContainer
            {...wrapperProps}
            propKey={propKey}
            keepAlive={combinedKeepAlive}
          />
        )
        : null;
    }
  }

  const KeepAlive = withKeepAliveContextConsumer(
    withIdentificationContextConsumer(ListenUpperKeepAliveContainer)
  ) as any;

  return hoistNonReactStatics(KeepAlive, Component);
}

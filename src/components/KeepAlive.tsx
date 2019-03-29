import React from 'react';
import {START_MOUNTING_DOM, LIFECYCLE} from './Provider';
import keepAlive, {COMMAND} from '../utils/keepAliveDecorator';
import changePositionByComment from '../utils/changePositionByComment';

interface IKeepAliveProps {
  key?: string;
  name?: string;
  disabled?: boolean;
  _container: any;
}

class KeepAlive extends React.PureComponent<IKeepAliveProps> {
  private bindUnmount: (() => void) | null = null;

  public componentDidMount() {
    const {
      _container,
    } = this.props;
    const {
      notNeedActivate,
      identification,
      eventEmitter,
    } = _container;
    notNeedActivate();
    const cb = () => {
      this.mount();
      this.listen();
      eventEmitter.off([identification, START_MOUNTING_DOM], cb);
    };
    eventEmitter.on([identification, START_MOUNTING_DOM], cb);
  }

  public componentDidUpdate() {
    const {
      _container,
    } = this.props;
    const {
      notNeedActivate,
      isNeedActivate,
    } = _container;
    if (isNeedActivate()) {
      notNeedActivate();
      this.mount();
      this.listen();
    }
  }

  public componentWillUnmount() {
    this.unmount();
    this.unlisten();
  }

  private mount() {
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

  private unmount() {
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

  private listen() {
    const {
      _container: {
        identification,
        eventEmitter,
      },
    } = this.props;
    eventEmitter.on(
      [identification, COMMAND.CURRENT_UNMOUNT],
      this.bindUnmount = this.componentWillUnmount.bind(this),
    );
  }

  private unlisten() {
    const {
      _container: {
        identification,
        eventEmitter,
      },
    } = this.props;
    eventEmitter.off([identification, COMMAND.CURRENT_UNMOUNT], this.bindUnmount);
  }

  public render() {
    return this.props.children;
  }
}

export default keepAlive<IKeepAliveProps>(KeepAlive);

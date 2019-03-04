import React from 'react';
import Comment from './Comment';
import {LIFECYCLE, ICache, ICacheItem} from './Provider';
import {warn} from '../utils/debug';
import findDOMNodeByFiberNode from '../utils/findDOMNodeByFiberNode';
import createUniqueIdentification from '../utils/createUniqueIdentification';

interface IConsumerProps {
  children: React.ReactNode;
  identification: string;
  keepAlive: boolean;
  cache: ICache;
  setCache: (identification: string, value: ICacheItem) => void;
  unactivate: (identification: string) => void;
}

class Consumer extends React.PureComponent<IConsumerProps> {
  private renderElement: HTMLElement;

  private identification: string = this.props.identification;

  // This attribute is designed to prevent duplicates of the identification of KeepAlive components.
  private key: string = createUniqueIdentification();

  constructor(props: IConsumerProps, ...args: any) {
    super(props, ...args);
    const {cache, setCache, children} = props;
    if (!cache || !setCache) {
      warn('[React Keep Alive] <KeepAlive> component must be in the <Provider> component.');
    }
    React.Children.only(children);
  }

  public componentDidMount() {
    const {
      setCache,
      children,
      keepAlive,
    } = this.props;
    const {_reactInternalFiber} = this as any;
    this.renderElement = findDOMNodeByFiberNode(_reactInternalFiber) as HTMLElement;
    setCache(this.identification, {
      children,
      keepAlive,
      lifecycle: LIFECYCLE.MOUNTED,
      key: this.key,
      renderElement: this.renderElement,
      activated: true,
    });
  }

  public componentDidUpdate() {
    const {
      setCache,
      children,
      keepAlive,
    } = this.props;
    setCache(this.identification, {
      children,
      keepAlive,
      lifecycle: LIFECYCLE.UPDATING,
    });
  }

  public componentWillUnmount() {
    const {unactivate} = this.props;
    unactivate(this.identification);
  }

  public render() {
    const {identification} = this;
    return <Comment>{identification}</Comment>;
  }
}

export default Consumer;

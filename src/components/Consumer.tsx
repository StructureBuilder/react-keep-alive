import React from 'react';
import Comment from './Comment';
import {LIFECYCLE, ICache, ICacheItem} from './Provider';

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

  private commentRef: any;

  private identification: string = this.props.identification;

  public componentDidMount() {
    const {
      setCache,
      children,
      keepAlive,
    } = this.props;
    this.renderElement = this.commentRef.parentNode;
    setCache(this.identification, {
      children,
      keepAlive,
      lifecycle: LIFECYCLE.MOUNTED,
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
    return <Comment ref={ref => this.commentRef = ref}>{identification}</Comment>;
  }
}

export default Consumer;

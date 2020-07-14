import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Comment from './Comment';
import KeepAliveContext from '../contexts/KeepAliveContext';
import createEventEmitter from '../utils/createEventEmitter';
import createUniqueIdentification from '../utils/createUniqueIdentification';
import createStoreElement from '../utils/createStoreElement';

export const keepAliveProviderTypeName = '$$KeepAliveProvider';
export const START_MOUNTING_DOM = 'startMountingDOM';

export enum CACHE_METHOD {
  FIFO = 'FIFO',
  LRU = 'LRU',
}

export enum LIFECYCLE {
  MOUNTED,
  UPDATING,
  UNMOUNTED,
}

export interface ICacheItem {
  children: React.ReactNode;
  keepAlive: boolean;
  lifecycle: LIFECYCLE;
  renderElement?: HTMLElement;
  activated?: boolean;
  ifStillActivate?: boolean;
  reactivate?: () => void;
}

export interface ICache {
  [key: string]: ICacheItem;
}

export interface IKeepAliveProviderImpl {
  storeElement: HTMLElement;
  cache: ICache;
  keys: string[];
  eventEmitter: any;
  existed: boolean;
  providerIdentification: string;
  setCache: (identification: string, value: ICacheItem) => void;
  unactivate: (identification: string) => void;
  isExisted: () => boolean;
}

export interface IKeepAliveProviderProps {
  include?: string | string[] | RegExp;
  exclude?: string | string[] | RegExp;
  max?: number;
  cacheMethod?: string;
}

export default class KeepAliveProvider extends React.PureComponent<IKeepAliveProviderProps> implements IKeepAliveProviderImpl {
  public static displayName = keepAliveProviderTypeName;

  public static defaultProps = {
    max: 10,
    cacheMethod: CACHE_METHOD.FIFO,
  };

  public storeElement: HTMLElement;

  // Sometimes data that changes with setState cannot be synchronized, so force refresh
  public cache: ICache = Object.create(null);

  public keys: string[] = [];

  public orderKeys: string[] = [];

  public eventEmitter = createEventEmitter();

  public existed: boolean = true;

  private needRerender: boolean = false;

  public providerIdentification: string = createUniqueIdentification();

  public componentDidMount() {
    this.storeElement = createStoreElement();
    this.forceUpdate();
  }

  public componentDidUpdate() {
    if (this.needRerender) {
      this.needRerender = false;
      this.forceUpdate();
    }
  }

  public componentWillUnmount() {
    this.existed = false;
    document.body.removeChild(this.storeElement);
  }

  public isExisted = () => {
    return this.existed;
  }

  public setCache = (identification: string, value: ICacheItem) => {
    const {cacheMethod} = this.props;
    switch (cacheMethod) {
      case CACHE_METHOD.FIFO:
        this.setCacheWithFIFO(identification, value);
        break;
      case CACHE_METHOD.LRU:
        this.setCacheWithLRU(identification, value);
        break;
      default: {
        throw new Error('Invaid cache method, only available with `FIFO` and `LRU`');
      }
    }
  }

  public setCacheWithFIFO = (identification: string, value: ICacheItem) => {
    const {cache, keys, orderKeys} = this;
    const currentCache = cache[identification];
    if (!currentCache) {
      keys.push(identification);
      orderKeys.push(identification);
    }
    this.update(identification, value);
  }

  public setCacheWithLRU = (identification: string, value: ICacheItem) => {
    const {cache, keys, orderKeys} = this;
    const currentCache = cache[identification];
    if (currentCache) {
      const idx = keys.findIndex(key => key === identification);
      keys.splice(idx, 1);
    } else {
      orderKeys.push(identification);
    }
    keys.push(identification);
    this.update(identification, value);
  }

  public update = (identification: string, value: ICacheItem) => {
    const {cache, keys, orderKeys} = this;
    const {max} = this.props;
    const currentCache = cache[identification];
    cache[identification] = {
      ...currentCache,
      ...value,
    };
    this.forceUpdate(() => {
      // If the maximum value is set, the value in the cache is deleted after it goes out.
      if (currentCache) {
        return;
      }
      if (!max) {
        return;
      }
      const difference = keys.length - (max as number);
      if (difference <= 0) {
        return;
      }
      const spliceKeys = keys.splice(0, difference);

      spliceKeys.forEach(key => {
        const idx = orderKeys.findIndex(oKey => oKey === key)
        if (idx !== -1) {
          orderKeys.splice(idx, 1)
        }
      })

      this.forceUpdate(() => {
        spliceKeys.forEach(key => {
          delete cache[key as string];
        });
      });
    });
  }

  public unactivate = (identification: string) => {
    const {cache} = this;
    this.cache[identification] = {
      ...cache[identification],
      activated: false,
      lifecycle: LIFECYCLE.UNMOUNTED,
    };
    this.forceUpdate();
  }

  private startMountingDOM = (identification: string) => {
    this.eventEmitter.emit([identification, START_MOUNTING_DOM]);
  }

  public render() {
    const {
      cache,
      keys,
      orderKeys,
      providerIdentification,
      isExisted,
      setCache,
      existed,
      unactivate,
      storeElement,
      eventEmitter,
    } = this;
    const {
      children: innerChildren,
      include,
      exclude,
    } = this.props;
    if (!storeElement) {
      return null;
    }
    return (
      <KeepAliveContext.Provider
        value={{
          cache,
          keys,
          existed,
          providerIdentification,
          isExisted,
          setCache,
          unactivate,
          storeElement,
          eventEmitter,
          include,
          exclude,
        }}
      >
        <React.Fragment>
          {innerChildren}
          {ReactDOM.createPortal(
            orderKeys.map(identification => {
              const currentCache = cache[identification];
              const {
                keepAlive,
                children,
                lifecycle,
              } = currentCache;
              let cacheChildren = children;
              if (lifecycle === LIFECYCLE.MOUNTED && !keepAlive) {
                // If the cache was last enabled, then the components of this keepAlive package are used,
                // and the cache is not enabled, the UI needs to be reset.
                cacheChildren = null;
                this.needRerender = true;
                currentCache.lifecycle = LIFECYCLE.UPDATING;
              }
              // current true, previous true | undefined, keepAlive false, not cache
              // current true, previous true | undefined, keepAlive true, cache

              // current true, previous false, keepAlive true, cache
              // current true, previous false, keepAlive false, not cache
              return (
                cacheChildren
                  ? (
                    <React.Fragment key={identification}>
                      <Comment>{identification}</Comment>
                      {cacheChildren}
                      <Comment
                        onLoaded={() => this.startMountingDOM(identification)}
                      >{identification}</Comment>
                    </React.Fragment>
                  )
                  : null
              );
            }),
            storeElement
          )}
        </React.Fragment>
      </KeepAliveContext.Provider>
    );
  }
}

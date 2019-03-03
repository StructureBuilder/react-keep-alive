import React from 'react';
import ReactDOM from 'react-dom';
import Comment from './Comment';
import {LIFECYCLE} from './Consumer';
import KeepAliveContext from '../contexts/KeepAliveContext';
import createEventEmitter from '../utils/createEventEmitter';
import createUniqueIdentification from '../utils/createUniqueIdentification';
import createStoreElement from '../utils/createStoreElement';

export const keepAliveProviderTypeName = 'KeepAliveProvider';
export const START_MOUNTING_DOM = 'startMountingDOM';

// TODO: include max exclude
export default class KeepAliveProvider extends React.PureComponent {
  storeElement = createStoreElement();

  // Sometimes data that changes with setState cannot be synchronized, so force refresh
  cache = Object.create(null);

  keys = [];

  eventEmitter = createEventEmitter();

  existed = true;

  needRerender = false;

  providerIdentification = createUniqueIdentification();

  componentDidUpdate() {
    if (this.needRerender) {
      this.needRerender = false;
      this.forceUpdate();
    }
  }

  componentWillUnmount() {
    this.eventEmitter.clear();
    this.existed = false;
    document.body.removeChild(this.storeElement);
  }

  isExisted = () => {
    return this.existed;
  };

  setCache = (identification, value) => {
    const {cache, keys} = this;
    const {key} = cache[identification] || {};
    if (!key) {
      keys.push(identification);
      // this.shiftKey();
    }
    if (key && value.key && key !== value.key) {
      throw new Error('Cached components have duplicates.');
    }
    this.cache[identification] = {
      ...cache[identification],
      ...value,
    };
    this.forceUpdate();
  };

  getMax = () => {
    return this.props.max ? parseInt(this.props.max) : null;
  };

  shiftKey = () => {
    const max = this.getMax();
    const {keys, cache} = this;
    if (!max || keys.length <= max) {
      return;
    }
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const currentCache = cache[key];
      if (currentCache && !currentCache.activated) {
        keys.splice(i, 1);
        delete cache[key];
        return;
      }
    }
  }

  unactivate = identification => {
    const {cache} = this;
    this.cache[identification] = {
      ...cache[identification],
      key: null,
      activated: false,
      lifecycle: LIFECYCLE.UNMOUNTED,
    };
    this.forceUpdate();
  };

  startMountingDOM = identification => {
    this.eventEmitter.emit([identification, START_MOUNTING_DOM]);
  };

  render() {
    const {
      cache,
      providerIdentification,
      isExisted,
      setCache,
      unactivate,
      shiftKey,
      storeElement,
      eventEmitter,
    } = this;
    const {
      children,
      include,
      exclude,
    } = this.props;
    return (
      <KeepAliveContext.Provider 
        value={{
          cache,
          providerIdentification,
          isExisted,
          setCache,
          shiftKey,
          unactivate,
          storeElement,
          eventEmitter,
          include,
          exclude,
        }}
      >
        <React.Fragment>
          {children}
          {
            Object.entries(cache).map((
              [
                identification,
                {
                  keepAlive,
                  children,
                  lifecycle,
                },
              ],
            ) => {
              const currentCache = cache[identification];
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
              return ReactDOM.createPortal(
                (
                  cacheChildren
                    ? (
                      <React.Fragment>
                        <Comment>{identification}</Comment>
                        {cacheChildren}
                        <Comment 
                          onLoaded={() => this.startMountingDOM(identification)}
                        >{identification}</Comment>
                      </React.Fragment>
                    )
                    : null
                ),
                storeElement,
              );
            })
          }
        </React.Fragment>
      </KeepAliveContext.Provider>
    );
  }
}
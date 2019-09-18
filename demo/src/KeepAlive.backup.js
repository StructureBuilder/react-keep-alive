import React from 'react';
import {cloneDeep} from 'lodash';
import {getStateBackup, deepForceUpdateByBackup} from './utils';

let backup = null;

const excludes = ['props', 'context', 'refs', 'updater', '_reactInternalFiber', '_reactInternalInstance'];

function createBackupElement(node) {
  const ExtendsCtor = node.constructor.name === '__Ctor__' ? node.constructor.__Ctor__ : node.constructor;
  class __Ctor__ extends ExtendsCtor {
    static __Ctor__ = node.constructor;

    constructor(...args) {
      super(...args);
      Object.keys(node.instance).forEach(key => {
        if (~excludes.indexOf(key)) {
          return;
        }
        if (typeof node.instance[key] === 'function') {
          return;
        }
        this[key] = node.instance[key];
      });
      const oldRender = this.render;
      this.render = (...args) => {
        const element = oldRender.call(this, ...args);
        const node = this.props.__render__.child;
        function deep(element, node) {
          if (!element) {
            if (node.current) {
              node.current = null;
              node.restored = true;
            }
            return element;
          }

          if (typeof element.type === 'function') {
            if (node.current === null && node.restored) {
              return element;
            }
            if (node.current) {
              return node.current;
            }
            node.current = createBackupElement(node);
            return node.current;
          }

          if (element.props && Array.isArray(element.props.children)) {
            if (!node) {
              return element;
            }
            let nodeChild = node.child;
            return React.createElement(element.type, {
              children: React.Children.map(element.props.children, inner => {
                const result = deep(inner, nodeChild);
                if (result) {
                  nodeChild = nodeChild.sibling;
                }
                return result;
              })
            });
          }

          return element;
        }
        return deep(element, node);
      };
    }
  }
  return React.createElement(__Ctor__, {
    __render__: node,
  });
}

export default class KeepAlive extends React.Component {
  __children__ = null;

  constructor(...args) {
    super(...args);
    this.__children__ = this.props.children;
    if (backup) {
      this.__children__ = createBackupElement(backup.child);
    }
  }

  componentWillUnmount() {
    backup = getStateBackup(cloneDeep(this._reactInternalFiber || this._reactInternalInstance));
  }

  render() {
    return this.__children__;
  }
}

import * as React from 'react';
import {bindLifecycleTypeName} from '../utils/bindLifecycle';

interface IProps {
  setMounted: (value: boolean) => void;
  getMounted: () => boolean;
  onUpdate: () => void;
}

interface IState {
  component: any;
}

export default class AsyncComponent extends React.Component<IProps, IState> {
  public state = {
    component: null,
  };

  /**
   * Force update child nodes
   *
   * @private
   * @returns
   * @memberof AsyncComponent
   */
  private forceUpdateChildren() {
    if (!this.props.children) {
      return;
    }
    const root: any = (this as any)._reactInternalFiber || (this as any)._reactInternalInstance;
    let node = root.child;
    let sibling = node;
    while (sibling) {
      while (true) {
        if (node.type && node.type.displayName && node.type.displayName.indexOf(bindLifecycleTypeName) !== -1) {
          return;
        }
        if (node.stateNode) {
          break;
        }
        node = node.child;
      }
      if (typeof node.type === 'function') {
        node.stateNode.forceUpdate();
      }
      sibling = sibling.sibling;
    }
  }

  public componentDidMount() {
    const {children} = this.props;
    Promise.resolve().then(() => this.setState({component: children}));
  }

  public componentDidUpdate() {
    this.props.onUpdate();
  }

  // Delayed update
  // In order to be able to get real DOM data
  public shouldComponentUpdate() {
    if (!this.state.component) {
      // If it is already mounted asynchronously, you don't need to do it again when you update it.
      this.props.setMounted(false);
      return true;
    }
    Promise.resolve().then(() => {
      if (this.props.getMounted()) {
        this.props.setMounted(false);
        this.forceUpdateChildren();
      }
    });
    return false;
  }

  public render() {
    return this.state.component;
  }
}

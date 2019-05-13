import * as React from 'react';
import deepForceUpdate from 'react-deep-force-update';

interface IProps {
  setMounted: any;
  getMounted: any;
  correctionPosition: any;
}

interface IState {
  component: any;
}

export default class AsyncComponent extends React.Component<IProps, IState> {
  public state = {
    component: null,
  };

  public componentDidMount() {
    const {children} = this.props;
    Promise.resolve().then(() => this.setState({component: children}));
  }

  public componentDidUpdate() {
    this.props.correctionPosition();
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
        deepForceUpdate(this);
      }
    });
    return false;
  }

  public render() {
    return this.state.component;
  }
}

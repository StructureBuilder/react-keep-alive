import React from 'react';
import Comment from './Comment';
import findDOMNodeByFiberNode from '../utils/findDOMNodeByFiberNode';
import createUniqueIdentification from '../utils/createUniqueIdentification';

export const LIFECYCLE = {
  MOUNTED: 0,
  UPDATING: 1,
  UNMOUNTED: 2,
};

class Consumer extends React.PureComponent {
  renderElement = null;
  
  identification = this.props.identification;

  // This attribute is designed to prevent duplicates of the identification of KeepAlive components.
  key = createUniqueIdentification();

  constructor(props) {
    super(props);
    const {cache, setCache, children} = props;
    if (!cache || !setCache) {
      throw new Error('<KeepAlive> component must be in the <Provider> component.');
    }
    React.Children.only(children);
  }

  componentDidMount() {
    const {
      setCache,
      children,
      keepAlive,
    } = this.props;
    const {_reactInternalFiber} = this;
    this.renderElement = findDOMNodeByFiberNode(_reactInternalFiber);
    setCache(this.identification, {
      children,
      keepAlive,
      lifecycle: LIFECYCLE.MOUNTED,
      key: this.key,
      renderElement: this.renderElement,
      activated: true,
    });
  }

  componentDidUpdate() {
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

  componentWillUnmount() {
    const {unactivate} = this.props;
    unactivate(this.identification);
  }

  render() {
    const {identification} = this;
    return <Comment>{identification}</Comment>;
  }
}

export default Consumer;
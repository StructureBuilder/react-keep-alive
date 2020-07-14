import React from 'react';
import {bindLifecycle} from '../../../es';

@bindLifecycle
class D extends React.Component {
  state = {
    value: false,
  };

  componentWillMount() {
    console.log('D componentWillMount');
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        value: true,
      });
    }, 1000);
    console.log('D componentDidMount');
  }

  componentDidActivate() {
    console.log('D componentDidActivate');
  }

  componentWillUpdate() {
    console.log('D componentWillUpdate');
  }

  componentDidUpdate() {
    console.log('D componentDidUpdate');
  }

  componentWillUnactivate() {
    console.log('D componentWillUnactivate');
  }

  componentWillUnmount() {
    console.log('D componentWillUnmount');
  }

  render() {
    console.log('D render');
    return (
      <div>
        {this.state.value ? <div>This is dddd.</div> : null}
      </div>
    );
  }
}

export default D;

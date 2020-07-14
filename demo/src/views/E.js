import React from 'react';
import { bindLifecycle } from '../../../es';

@bindLifecycle
class E extends React.Component {
  state = {
    value: false,
  };

  componentWillMount() {
    console.log('E componentWillMount');
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        value: true,
      });
    }, 1000);
    console.log('E componentEidMount');
  }

  componentDidActivate() {
    console.log('E componentDidActivate');
  }

  componentWillUpdate() {
    console.log('E componentWillUpdate');
  }

  componentDidUpdate() {
    console.log('E componentDidUpdate');
  }

  componentWillUnactivate() {
    console.log('E componentWillUnactivate');
  }

  componentWillUnmount() {
    console.log('E componentWillUnmount');
  }

  render() {
    console.log('E render');
    return (
      <div>
        {this.state.value ? <div>This is egg.</div> : null}
      </div>
    );
  }
}

export default E;

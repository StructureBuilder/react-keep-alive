import React from 'react';
import { bindLifecycle } from '../../../es';

@bindLifecycle
class F extends React.Component {
  state = {
    value: false,
  };

  componentWillMount() {
    console.log('F componentWillMount');
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        value: true,
      });
    }, 1000);
    console.log('F componentEidMount');
  }

  componentDidActivate() {
    console.log('F componentDidActivate');
  }

  componentWillUpdate() {
    console.log('F componentWillUpdate');
  }

  componentDidUpdate() {
    console.log('F componentDidUpdate');
  }

  componentWillUnactivate() {
    console.log('F componentWillUnactivate');
  }

  componentWillUnmount() {
    console.log('F componentWillUnmount');
  }

  render() {
    console.log('F render');
    return (
      <div>
        {this.state.value ? <div>This is flag.</div> : null}
      </div>
    );
  }
}

export default F;

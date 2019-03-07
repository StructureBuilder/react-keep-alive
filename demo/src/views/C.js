import React from 'react';
import {keepAlive} from '../../../es';

class C extends React.Component {
  componentWillMount() {
    console.log('C componentWillMount');
  }

  componentDidMount() {
    console.log('C componentDidMount');
  }

  componentDidActivate() {
    console.log('C componentDidActivate');
  }

  componentWillUpdate() {
    console.log('C componentWillUpdate');
  }

  componentDidUpdate() {
    console.log('C componentDidUpdate');
  }

  componentWillUnactivate() {
    console.log('C componentWillUnactivate');
  }

  componentWillUnmount() {
    console.log('C componentWillUnmount');
  }

  render() {
    console.log('C render');
    return (
      <div>This is c.</div>
    );
  }
}

export default keepAlive()(C);

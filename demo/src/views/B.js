import React from 'react';

export default class Test extends React.Component {
  componentWillMount() {
    console.log('B componentWillMount');
  }

  componentDidMount() {
    console.log('B componentDidMount');
  }

  componentDidActivate() {
    console.log('B componentDidActivate');
  }

  componentWillUpdate() {
    console.log('B componentWillUpdate');
  }

  componentDidUpdate() {
    console.log('B componentDidUpdate');
  }

  componentWillUnactivate() {
    console.log('B componentWillUnactivate');
  }

  componentWillUnmount() {
    console.log('B componentWillUnmount');
  }

  render() {
    console.log('B render');
    return (
      <div>This is b.</div>
    );
  }
}

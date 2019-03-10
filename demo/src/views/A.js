import React from 'react';
import {bindLifecycle} from '../../../es';

@bindLifecycle
class Content extends React.Component {
  componentWillMount() {
    console.log('A Content componentWillMount');
  }

  componentDidMount() {
    console.log('A Content componentDidMount');
  }

  componentDidActivate() {
    console.log('A Content componentDidActivate');
  }

  componentWillUpdate() {
    console.log('A Content componentWillUpdate');
  }

  componentDidUpdate() {
    console.log('A Content componentDidUpdate');
  }

  componentWillUnactivate() {
    console.log('A Content componentWillUnactivate');
  }

  componentWillUnmount() {
    console.log('A Content componentWillUnmount');
  }

  render() {
    console.log('A Content render');
    console.log(this);
    return (
      <div>This is a content.</div>
    );
  }
}

@bindLifecycle
class Test extends React.Component {
  state = {
    index: 0,
  };

  componentWillMount() {
    console.log('A componentWillMount');
  }

  componentDidMount() {
    console.log('A componentDidMount');
  }

  componentDidActivate() {
    console.log('A componentDidActivate');
  }

  componentWillUpdate() {
    console.log('A componentWillUpdate');
  }

  componentDidUpdate() {
    console.log('A componentDidUpdate');
  }

  componentWillUnactivate() {
    console.log('A componentWillUnactivate');
  }

  componentWillUnmount() {
    console.log('A componentWillUnmount');
  }

  handleClick = () => {
    this.setState(({index}) => ({index: ++index}));
  };

  render() {
    console.log('A render');
    return (
      <div>
        <div>This is a.</div>
        <button onClick={this.handleClick}>click me({this.state.index})</button>
        <Content />
      </div>
    );
  }
}

export default Test;

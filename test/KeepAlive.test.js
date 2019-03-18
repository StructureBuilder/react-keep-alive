import React from 'react';
import {mount} from 'enzyme';
import {KeepAlive} from '../src';

class Test extends React.Component {
  state = {
    index: 0,
  };

  handleAdd = () => {
    this.setState(({index}) => ({
      index: index + 1,
    }));
  }

  render() {
    return this.state.index;
  }
}

describe('<KeepAlive>', () => {
  it('<KeepAlive> not <Provider> will report an error', () => {
    expect(() => {
      mount(
        <KeepAlive>
          <Test />
        </KeepAlive>,
      );
    }).toThrow('[React Keep Alive]');
  });
});

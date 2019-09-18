import React from 'react';
import {getStateBackup, deepForceUpdateByBackup} from './utils';

let backup = null;

export default class KeepAlive extends React.Component {
  componentDidMount() {
    if (backup) {
      deepForceUpdateByBackup(this, backup);
    }
  }

  componentWillUnmount() {
    backup = getStateBackup(this);
  }

  render() {
    return this.props.children;
  }
}


